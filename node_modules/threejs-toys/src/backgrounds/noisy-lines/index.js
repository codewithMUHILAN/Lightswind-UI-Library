import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three'
import three from '../../three'
import useCanvasTexture from '../../tools/canvasTexture'
import psrdnoise from '../../glsl/psrdnoise2.glsl'
import { colorScale } from '../../tools/color'

const defaultConfig = {
  colors: [0xffffff, 0x000000],
  minStroke: 5,
  maxStroke: 5,
  timeCoef: 0.0005,
  coordScale: 2,
  displacementScale: 0.002,
  mouseScale: 0.25,
  mouseLerp: 0.025
}

export default function (params) {
  const config = { ...defaultConfig, ...params }

  const canvasTexture = useCanvasTexture({ width: 1, height: 4096 })
  drawTexture()

  const uniforms = {
    uMap: { value: canvasTexture.texture },
    uTime: { value: 0 },
    uCoordScale: { value: config.coordScale },
    uDisplacementScale: { value: config.displacementScale },
    uMouse: { value: new Vector2() }
  }

  const geometry = new PlaneGeometry()

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform float uTime;
      uniform float uCoordScale;
      uniform float uDisplacementScale;
      uniform vec2 uMouse;
      varying vec2 vUv;
      ${psrdnoise}
      void main() {
        vec2 p = vec2(0.0);
        vec2 grad;
        float n = psrdnoise(vUv * uCoordScale + uMouse, p, uTime, grad);
        // grad *= uCoordScale;
        vec2 uv = vUv + uDisplacementScale * grad;
        gl_FragColor = texture2D(uMap, uv.yx);
      }
    `
  })

  const mesh = new Mesh(geometry, material)

  const mouseTarget = new Vector2()

  const threeConfig = {}
  const keys = ['el', 'canvas', 'width', 'height', 'resize']
  keys.forEach(key => {
    if (params[key] !== undefined) threeConfig[key] = params[key]
  })

  three({
    ...threeConfig,
    antialias: true,
    initScene ({ camera, scene, wWidth, wHeight }) {
      mesh.scale.set(wWidth * 2, wHeight * 2, 1)
      scene.add(mesh)

      camera.position.set(0, -30, 7)
      camera.lookAt(0, -19, 0)
    },
    beforeRender ({ clock }) {
      uniforms.uTime.value = clock.time * config.timeCoef
      uniforms.uMouse.value.lerp(mouseTarget, config.mouseLerp)
    },
    onPointerMove ({ nPosition }) {
      mouseTarget.set(-nPosition.x, nPosition.y).multiplyScalar(config.mouseScale)
    },
    onPointerLeave () {
      mouseTarget.set(0, 0)
    }
  })

  return { config, uniforms, drawTexture }

  function drawTexture () {
    const ctx = canvasTexture.ctx
    ctx.lineWidth = 0

    const { width, height } = canvasTexture.canvas
    const cscale = colorScale(config.colors)

    let y = 0
    let dy
    while (y < height) {
      dy = config.minStroke + Math.random() * (config.maxStroke - config.minStroke)

      // ctx.strokeStyle = cscale.getColorAt(Math.random()).getStyle()
      // ctx.lineWidth = dy + 1
      // ctx.beginPath()
      // ctx.moveTo(0, y + dy / 2)
      // ctx.lineTo(width, y + dy / 2)
      // ctx.stroke()
      // ctx.closePath()

      ctx.fillStyle = cscale.getColorAt(Math.random()).getStyle()
      ctx.beginPath()
      ctx.rect(0, y - 1, width, dy + 1)
      ctx.fill()
      ctx.closePath()

      y += dy
    }

    canvasTexture.texture.needsUpdate = true
  }
}
