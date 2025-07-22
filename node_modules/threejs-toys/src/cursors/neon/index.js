import { Color, Mesh, OrthographicCamera, PlaneGeometry, ShaderMaterial, SplineCurve, Vector2, Vector3 } from 'three'
import three from '../../three'

const defaultConfig = {
  shaderPoints: 8,
  curvePoints: 80,
  curveLerp: 0.75,
  radius1: 3,
  radius2: 5,
  velocityTreshold: 10,
  sleepRadiusX: 150,
  sleepRadiusY: 150,
  sleepTimeCoefX: 0.0025,
  sleepTimeCoefY: 0.0025
}

export default function (params) {
  const config = { ...defaultConfig, ...params }

  const points = new Array(config.curvePoints).fill(0).map(() => new Vector2())
  const spline = new SplineCurve(points)

  const velocity = new Vector3()
  const velocityTarget = new Vector3()

  const uRatio = { value: new Vector2() }
  const uSize = { value: new Vector2() }
  const uPoints = { value: new Array(config.shaderPoints).fill(0).map(() => new Vector2()) }
  const uColor = { value: new Color(0xff00ff) }

  let material
  let plane
  let hover = false

  const threeConfig = {}
  const keys = ['el', 'canvas', 'width', 'height', 'resize']
  keys.forEach(key => {
    if (params[key] !== undefined) threeConfig[key] = params[key]
  })

  three({
    ...threeConfig,
    antialias: false,
    initCamera (three) {
      three.camera = new OrthographicCamera()
    },
    initScene ({ scene }) {
      const geometry = new PlaneGeometry(2, 2)
      material = new ShaderMaterial({
        uniforms: { uRatio, uSize, uPoints, uColor },
        defines: {
          SHADER_POINTS: config.shaderPoints
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          // https://www.shadertoy.com/view/wdy3DD
          // https://www.shadertoy.com/view/MlKcDD
          // Signed distance to a quadratic bezier
          float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
            vec2 a = B - A;
            vec2 b = A - 2.0*B + C;
            vec2 c = a * 2.0;
            vec2 d = A - pos;
            float kk = 1.0 / dot(b,b);
            float kx = kk * dot(a,b);
            float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
            float kz = kk * dot(d,a);
            float res = 0.0;
            float p = ky - kx*kx;
            float p3 = p*p*p;
            float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
            float h = q*q + 4.0*p3;
            if(h >= 0.0){
              h = sqrt(h);
              vec2 x = (vec2(h, -h) - q) / 2.0;
              vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
              float t = uv.x + uv.y - kx;
              t = clamp( t, 0.0, 1.0 );
              // 1 root
              vec2 qos = d + (c + b*t)*t;
              res = length(qos);
            } else {
              float z = sqrt(-p);
              float v = acos( q/(p*z*2.0) ) / 3.0;
              float m = cos(v);
              float n = sin(v)*1.732050808;
              vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
              t = clamp( t, 0.0, 1.0 );
              // 3 roots
              vec2 qos = d + (c + b*t.x)*t.x;
              float dis = dot(qos,qos);
              res = dis;
              qos = d + (c + b*t.y)*t.y;
              dis = dot(qos,qos);
              res = min(res,dis);
              qos = d + (c + b*t.z)*t.z;
              dis = dot(qos,qos);
              res = min(res,dis);
              res = sqrt( res );
            }
            return res;
          }

          uniform vec2 uRatio;
          uniform vec2 uSize;
          uniform vec2 uPoints[SHADER_POINTS];
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float intensity = 1.0;
            float radius = 0.015;

            vec2 pos = (vUv - 0.5) * uRatio;

            vec2 c = (uPoints[0] + uPoints[1]) / 2.0;
            vec2 c_prev;
            float dist = 10000.0;
            for(int i = 0; i < SHADER_POINTS - 1; i++){
              c_prev = c;
              c = (uPoints[i] + uPoints[i + 1]) / 2.0;
              dist = min(dist, sdBezier(pos, c_prev, uPoints[i], c));
            }
            dist = max(0.0, dist);

            float glow = pow(uSize.y / dist, intensity);
            vec3 col = vec3(0.0);
            col += 10.0 * vec3(smoothstep(uSize.x, 0.0, dist));
            col += glow * uColor;

            // Tone mapping
            col = 1.0 - exp(-col);
            col = pow(col, vec3(0.4545));
  
            gl_FragColor = vec4(col, 1.0);
          }
        `
      })
      plane = new Mesh(geometry, material)
      scene.add(plane)
    },
    afterResize ({ width, height }) {
      uSize.value.set(config.radius1, config.radius2)
      if (width >= height) {
        uRatio.value.set(1, height / width)
        uSize.value.multiplyScalar(1 / width)
      } else {
        uRatio.value.set(width / height, 1)
        uSize.value.multiplyScalar(1 / height)
      }
    },
    beforeRender ({ clock, width, height, wWidth }) {
      for (let i = 1; i < config.curvePoints; i++) {
        points[i].lerp(points[i - 1], config.curveLerp)
      }
      for (let i = 0; i < config.shaderPoints; i++) {
        spline.getPoint(i / (config.shaderPoints - 1), uPoints.value[i])
      }

      if (!hover) {
        const t1 = clock.time * config.sleepTimeCoefX
        const t2 = clock.time * config.sleepTimeCoefY
        const cos = Math.cos(t1)
        const sin = Math.sin(t2)
        const r1 = config.sleepRadiusX * wWidth / width
        const r2 = config.sleepRadiusY * wWidth / width
        const x = r1 * cos
        const y = r2 * sin
        spline.points[0].set(x, y)
        uColor.value.r = 0.5 + 0.5 * Math.cos(clock.time * 0.0015)
        uColor.value.g = 0
        uColor.value.b = 1 - uColor.value.r
      } else {
        uColor.value.r = velocity.z
        uColor.value.g = 0
        uColor.value.b = 1 - velocity.z
        velocity.multiplyScalar(0.95)
      }
    },
    onPointerMove ({ nPosition, delta }) {
      hover = true
      const x = (0.5 * nPosition.x) * uRatio.value.x
      const y = (0.5 * nPosition.y) * uRatio.value.y
      spline.points[0].set(x, y)

      velocityTarget.x = Math.min(velocity.x + Math.abs(delta.x) / config.velocityTreshold, 1)
      velocityTarget.y = Math.min(velocity.y + Math.abs(delta.y) / config.velocityTreshold, 1)
      velocityTarget.z = Math.sqrt(velocityTarget.x * velocityTarget.x + velocityTarget.y * velocityTarget.y)
      velocity.lerp(velocityTarget, 0.05)
    },
    onPointerLeave () {
      hover = false
    }
  })

  return { config }
}
