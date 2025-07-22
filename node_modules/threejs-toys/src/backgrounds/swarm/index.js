import { BoxGeometry, BufferGeometry, CapsuleGeometry, Color, ConeGeometry, DoubleSide, Float32BufferAttribute, HalfFloatType, InstancedBufferAttribute, InstancedMesh, MathUtils, MeshStandardMaterial, OctahedronGeometry, SphereGeometry, Vector2, Vector3 } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import three, { commonConfig, initLights } from '../../three'
import psrdnoise from '../../glsl/psrdnoise3.glsl'
import { colorScale } from '../../tools/color'

const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils

const defaultConfig = {
  gpgpuSize: 256,
  bloomStrength: 1.5,
  bloomRadius: 0.5,
  bloomThreshold: 0.25,
  colors: [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
  geometry: 'custom',
  geometryScale: [1, 1, 1],
  lights: [
    { type: 'ambient', params: [0xffffff, 0.5] },
    { type: 'point', params: [0xffffff, 1], props: { position: [0, 0, 0] } },
    { type: 'point', params: [0xff9060, 0.75], props: { position: [0, -100, -100] } },
    { type: 'point', params: [0x6090ff, 0.75], props: { position: [0, 100, 100] } }
  ],
  materialParams: {},
  noiseCoordScale: 0.01,
  noiseIntensity: 0.0025,
  noiseTimeCoef: 0.0004,
  attractionRadius1: 150,
  attractionRadius2: 250,
  maxVelocity: 0.25
}

export default function (params) {
  const config = { ...defaultConfig, ...params }

  const WIDTH = config.gpgpuSize
  const COUNT = WIDTH * WIDTH

  let gpu
  let dtPosition, dtVelocity
  let velocityVariable, positionVariable

  const uTexturePosition = { value: null }
  const uOldTexturePosition = { value: null }
  const uTextureVelocity = { value: null }
  const uScale = { value: new Vector3(...config.geometryScale) }
  const uTime = { value: 0 }
  const uNoiseCoordScale = { value: config.noiseCoordScale }
  const uNoiseIntensity = { value: config.noiseIntensity }
  const uMaxVelocity = { value: config.maxVelocity }
  const uAttractionRadius1 = { value: config.attractionRadius1 }
  const uAttractionRadius2 = { value: config.attractionRadius2 }
  const uMouse = { value: new Vector3() }

  const gpuTexturesUniforms = { uTexturePosition, uOldTexturePosition, uTextureVelocity }
  const commonUniforms = { uScale, uTime, uNoiseCoordScale, uNoiseIntensity, uMaxVelocity, uAttractionRadius1, uAttractionRadius2, uMouse }
  const uniforms = { ...gpuTexturesUniforms, ...commonUniforms }

  let effectComposer
  let renderPass, bloomPass

  let camera
  let geometry, material, iMesh

  // const mousePlane = new Plane(new Vector3(0, 0, 1), 0)
  // const mousePosition = new Vector3()
  // const raycaster = new Raycaster()

  const _three = three({
    ...commonConfig(params),
    antialias: false,
    orbitControls: true,
    initRenderer ({ renderer }) {
      initGPU(renderer)
    },
    initCamera (three) {
      camera = three.camera
      camera.position.z = 70
    },
    initScene ({ renderer, width, height, camera, scene }) {
      initScene(scene)

      renderPass = new RenderPass(scene, camera)
      bloomPass = new UnrealBloomPass(new Vector2(width, height), config.bloomStrength, config.bloomRadius, config.bloomThreshold)
      effectComposer = new EffectComposer(renderer)
      effectComposer.addPass(renderPass)
      effectComposer.addPass(bloomPass)
    },
    afterResize ({ width, height }) {
      if (effectComposer) effectComposer.setSize(width, height)
    },
    beforeRender ({ clock }) {
      uTime.value = clock.time * config.noiseTimeCoef
      // uMouse.value.copy(mousePosition)

      gpu.compute()
      uTexturePosition.value = positionVariable.renderTargets[gpu.currentTextureIndex].texture
      uOldTexturePosition.value = positionVariable.renderTargets[gpu.currentTextureIndex === 0 ? 1 : 0].texture
      uTextureVelocity.value = velocityVariable.renderTargets[gpu.currentTextureIndex].texture
    },
    render () {
      effectComposer.render()
    }
    // onPointerMove ({ nPosition }) {
    //   raycaster.setFromCamera(nPosition, camera)
    //   camera.getWorldDirection(mousePlane.normal)
    //   raycaster.ray.intersectPlane(mousePlane, mousePosition)
    // },
    // onPointerLeave () {
    //   mousePosition.set(0, 0, 0)
    // }
  })

  return { three: _three, config, uniforms, setColors }

  /**
   */
  function initGPU (renderer) {
    gpu = new GPUComputationRenderer(WIDTH, WIDTH, renderer)
    if (!renderer.capabilities.isWebGL2) {
      gpu.setDataType(HalfFloatType)
    }

    dtPosition = gpu.createTexture()
    dtVelocity = gpu.createTexture()
    initTextures(dtPosition, dtVelocity)

    velocityVariable = gpu.addVariable('textureVelocity', `
      ${psrdnoise}
      uniform float uTime;
      uniform vec3 uMouse;
      uniform float uNoiseCoordScale;
      uniform float uNoiseIntensity;
      uniform float uMaxVelocity;
      uniform float uAttractionRadius1;
      uniform float uAttractionRadius2;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);

        vec3 grad;
        float n = psrdnoise(pos.xyz * uNoiseCoordScale, vec3(0), uTime, grad);
        vel.xyz += (pos.w * 0.75) * grad * uNoiseIntensity;

        vec3 dv = -pos.xyz;
        float coef = smoothstep(uAttractionRadius1, uAttractionRadius2, length(dv));
        vel.xyz = vel.xyz + pos.w * coef * normalize(dv);
        vel.xyz = clamp(vel.xyz, -uMaxVelocity, uMaxVelocity);

        gl_FragColor = vel;
      }
    `, dtVelocity)

    positionVariable = gpu.addVariable('texturePosition', `
      ${psrdnoise}
      uniform float uTime;
      uniform vec3 uMouse;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);
        pos.xyz += vel.xyz;
        gl_FragColor = pos;
      }
    `, dtPosition)

    gpu.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])
    gpu.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])

    Object.keys(commonUniforms).forEach(key => {
      velocityVariable.material.uniforms[key] = uniforms[key]
      positionVariable.material.uniforms[key] = uniforms[key]
    })

    const error = gpu.init()
    if (error !== null) {
      throw new Error(error)
    }
  }

  /**
   */
  function initScene (scene) {
    if (config.background !== undefined) {
      scene.background = new Color(config.background)
    }

    initLights(scene, config.lights)

    switch (config.geometry) {
      case 'box' :
        geometry = new BoxGeometry()
        break
      case 'capsule' :
        geometry = new CapsuleGeometry(0.2, 1, 4, 8).rotateX(Math.PI / 2)
        break
      case 'cone' :
        geometry = new ConeGeometry(0.4, 2, 6).rotateX(Math.PI / 2)
        break
      case 'octahedron':
        geometry = new OctahedronGeometry(1, 0).rotateX(Math.PI / 2)
        break
      case 'sphere' :
        geometry = new SphereGeometry(0.5, 8, 8)
        break
      default:
        geometry = customGeometry(1)
    }

    const gpuUvs = new Float32Array(COUNT * 2)
    let index = 0
    for (let j = 0; j < WIDTH; j++) {
      for (let i = 0; i < WIDTH; i++) {
        gpuUvs[index++] = i / (WIDTH - 1)
        gpuUvs[index++] = j / (WIDTH - 1)
      }
    }
    geometry.setAttribute('gpuUv', new InstancedBufferAttribute(gpuUvs, 2))

    material = new MeshStandardMaterial({
      metalness: 0.75,
      roughness: 0.25,
      side: DoubleSide,
      ...config.materialParams,
      onBeforeCompile: shader => {
        Object.keys(uniforms).forEach(key => {
          shader.uniforms[key] = uniforms[key]
        })
        shader.vertexShader = `
          uniform sampler2D uTexturePosition;
          uniform sampler2D uOldTexturePosition;
          uniform sampler2D uTextureVelocity;
          uniform vec3 uScale;
          attribute vec2 gpuUv;
          varying vec4 vPos;
          varying vec4 vVel;

          mat3 lookAt(vec3 origin, vec3 target, vec3 up) {
            vec3 z = target - origin;
            if (z.x * z.x + z.y * z.y + z.z * z.z == 0.0) { z.z = 1.0; }
            z = normalize(z);
            vec3 x = cross(up, z);
            if (x.x * x.x + x.y * x.y + x.z * x.z == 0.0) {
              if (abs(up.z) == 1.0) { z.x += 0.0001; }
              else { z.z += 0.0001; }
              x = cross(up, z);
            }
            x = normalize(x);
            vec3 y = cross(z, x);
            return mat3(x, y, z);
          }

          mat4 iMatrix(vec3 pos, mat3 rmat, vec3 scale) {
            return mat4(
              rmat[0][0] * scale.x, rmat[0][1] * scale.x, rmat[0][2] * scale.x, 0.0,
              rmat[1][0] * scale.y, rmat[1][1] * scale.y, rmat[1][2] * scale.y, 0.0,
              rmat[2][0] * scale.z, rmat[2][1] * scale.z, rmat[2][2] * scale.z, 0.0,
              pos.x, pos.y, pos.z, 1.0
            );
          }
        ` + shader.vertexShader
        shader.vertexShader = shader.vertexShader.replace('#include <defaultnormal_vertex>', `
          vPos = texture2D(uTexturePosition, gpuUv);
          vec4 oldPos = texture2D(uOldTexturePosition, gpuUv);
          vVel = texture2D(uTextureVelocity, gpuUv);

          mat3 rmat = lookAt(oldPos.xyz, vPos.xyz, vec3(0, 1, 0));
          mat4 im = iMatrix(vPos.xyz, rmat, (0.5 + vPos.w) * uScale);

          vec3 transformedNormal = objectNormal;
          mat3 m = mat3(im);
          transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
          transformedNormal = m * transformedNormal;
          transformedNormal = normalMatrix * transformedNormal;
        `)
        shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
          vec4 mvPosition = modelViewMatrix * im * vec4(transformed, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        `)
      }
    })

    iMesh = new InstancedMesh(geometry, material, COUNT)
    setColors(config.colors)
    scene.add(iMesh)
  }

  /**
   */
  function setColors (colors) {
    if (Array.isArray(colors) && colors.length > 1) {
      const cscale = colorScale(colors)
      for (let i = 0; i < COUNT; i++) {
        iMesh.setColorAt(i, cscale.getColorAt(i / COUNT))
      }
      iMesh.instanceColor.needsUpdate = true
    }
  }

  /**
   */
  function initTextures (texturePosition, textureVelocity) {
    const dummy = new Vector3()
    const posArray = texturePosition.image.data
    const velArray = textureVelocity.image.data
    for (let k = 0, kl = posArray.length; k < kl; k += 4) {
      dummy.set(rndFS(1), rndFS(1), rndFS(1)).normalize().multiplyScalar(rndFS(config.attractionRadius1 * 2))
      dummy.toArray(posArray, k)
      posArray[k + 3] = rnd(0.1, 1)

      // dummy.set(rndFS(1), rndFS(1), rndFS(1)).normalize().multiplyScalar(0.1)
      dummy.set(0, 0, 0)
      dummy.toArray(velArray, k)
      velArray[k + 3] = 0
    }
  }
}

function customGeometry (size) {
  const vertices = [
    { p: [size * 0.5, 0, -size], n: [0, 1, 0] },
    { p: [-size * 0.5, 0, -size], n: [0, 1, 0] },
    { p: [0, 0, size], n: [0, 1, 0] },
    { p: [0, -size * 0.5, -size], n: [1, 0, 0] },
    { p: [0, size * 0.5, -size], n: [1, 0, 0] },
    { p: [0, 0, size], n: [1, 0, 0] }
  ]

  const indexes = [0, 1, 2, 3, 4, 5]

  const positions = []
  const normals = []
  for (const vertex of vertices) {
    positions.push(...vertex.p)
    normals.push(...vertex.n)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geometry.setIndex(indexes)

  return geometry
}
