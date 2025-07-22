import { Color, DoubleSide, FogExp2, HalfFloatType, InstancedBufferAttribute, InstancedMesh, MathUtils, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, PlaneGeometry, TextureLoader, Vector3 } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

import three, { commonConfig, initLights } from '../../three'
import psrdnoise from '../../glsl/psrdnoise3.glsl'
import { colorScale } from '../../tools/color'

const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils

const defaultConfig = {
  gpgpuSize: 64,
  background: 0xffffff,
  material: 'basic',
  materialParams: {},
  texture: null,
  textureCount: 1,
  colors: [0xffffff, 0xffffff],
  lights: [
    { type: 'ambient', params: [0xffffff, 0.5] },
    { type: 'directional', params: [0xffffff, 0.5], props: { position: [20, 50, 100] } }
  ],
  fogDensity: 0.01,
  fishScale: [1, 1, 1],
  fishWidthSegments: 8,
  fishSpeed: 1.5,
  fishDisplacementScale: 0.2,
  noiseCoordScale: 0.02,
  noiseTimeCoef: 0.0005,
  noiseIntensity: 0.0025,
  attractionRadius1: 50,
  attractionRadius2: 100,
  maxVelocity: 0.1
}

export default function (params) {
  const config = { ...defaultConfig, ...params }

  if (!['basic', 'phong', 'standard'].includes(config.material)) {
    throw new Error(`Invalid material ${config.material}`)
  }

  if (!Number.isInteger(config.fishWidthSegments) || config.fishWidthSegments % 2 !== 0) {
    throw new Error(`Invalid fishWidthSegments ${config.fishWidthSegments}`)
  }

  const WIDTH = config.gpgpuSize
  const COUNT = WIDTH * WIDTH

  let gpu
  let dtPosition, dtVelocity
  let velocityVariable, positionVariable

  const uTexturePosition = { value: null }
  const uOldTexturePosition = { value: null }
  const uTextureVelocity = { value: null }
  const uTime = { value: 0 }
  const uNoiseCoordScale = { value: config.noiseCoordScale }
  const uNoiseIntensity = { value: config.noiseIntensity }
  const uMaxVelocity = { value: config.maxVelocity }
  const uAttractionRadius1 = { value: config.attractionRadius1 }
  const uAttractionRadius2 = { value: config.attractionRadius2 }
  const uFishScale = { value: new Vector3(...config.fishScale) }
  const uFishSpeed = { value: config.fishSpeed }
  const uFishDisplacementScale = { value: config.fishDisplacementScale }

  const gpuTexturesUniforms = { uTexturePosition, uOldTexturePosition, uTextureVelocity }
  const commonUniforms = { uTime, uNoiseCoordScale, uNoiseIntensity, uMaxVelocity, uAttractionRadius1, uAttractionRadius2, uFishScale, uFishSpeed, uFishDisplacementScale }
  const uniforms = { ...gpuTexturesUniforms, ...commonUniforms }

  let geometry, material, iMesh

  const _three = three({
    ...commonConfig(params),
    antialias: true,
    orbitControls: true,
    initRenderer ({ renderer }) {
      initGPU(renderer)
    },
    initCamera ({ camera }) {
      camera.position.set(0, 20, 70)
    },
    initScene ({ scene }) {
      initScene(scene)
    },
    beforeRender ({ clock }) {
      uTime.value = clock.time * config.noiseTimeCoef

      gpu.compute()
      uTexturePosition.value = positionVariable.renderTargets[gpu.currentTextureIndex].texture
      uOldTexturePosition.value = positionVariable.renderTargets[gpu.currentTextureIndex === 0 ? 1 : 0].texture
      uTextureVelocity.value = velocityVariable.renderTargets[gpu.currentTextureIndex].texture
    }
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
      uniform float uNoiseCoordScale;
      uniform float uNoiseIntensity;
      uniform float uMaxVelocity;
      uniform float uAttractionRadius1;
      uniform float uAttractionRadius2;
      uniform float uFishSpeed;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);

        vec3 grad;
        float n = psrdnoise(pos.xyz * uNoiseCoordScale, vec3(0), uTime, grad);
        grad = grad * uNoiseIntensity;
        vel.xyz = vel.xyz + (pos.w * 0.75) * grad;

        vec3 dv = -pos.xyz;
        float coef = smoothstep(uAttractionRadius1, uAttractionRadius2, length(dv));
        vel.xyz = vel.xyz + pos.w * coef * normalize(dv);
        vel.xyz = clamp(vel.xyz, -uMaxVelocity, uMaxVelocity);

        vel.w = mod(vel.w + length(vel.xyz) * (0.5 + pos.w) * uFishSpeed, 6.2831853071);
        gl_FragColor = vel;
      }
    `, dtVelocity)

    positionVariable = gpu.addVariable('texturePosition', `
      ${psrdnoise}
      uniform float uTime;
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
      if (config.fogDensity) scene.fog = new FogExp2(config.background, config.fogDensity)
    }

    initLights(scene, config.lights)

    geometry = new PlaneGeometry(2, 1, config.fishWidthSegments, 1).rotateY(Math.PI / 2)

    const gpuUvs = new Float32Array(COUNT * 2)
    const mapIndexes = new Float32Array(COUNT)
    let i1 = 0
    let i2 = 0
    for (let j = 0; j < WIDTH; j++) {
      for (let i = 0; i < WIDTH; i++) {
        gpuUvs[i1++] = i / (WIDTH - 1)
        gpuUvs[i1++] = j / (WIDTH - 1)
        mapIndexes[i2++] = Math.floor(Math.random() * config.textureCount)
      }
    }
    geometry.setAttribute('gpuUv', new InstancedBufferAttribute(gpuUvs, 2))
    geometry.setAttribute('mapIndex', new InstancedBufferAttribute(mapIndexes, 1))

    const materialParams = { side: DoubleSide, ...config.materialParams }
    if (config.texture) {
      materialParams.map = new TextureLoader().load(config.texture)
    }

    materialParams.onBeforeCompile = shader => {
      shader.defines = {
        COMPUTE_NORMALS: config.material !== 'basic',
        FISH_DZ: (2.0 / config.fishWidthSegments).toFixed(10),
        TEXTURE_COUNT: config.textureCount.toFixed(10)
      }
      Object.keys(uniforms).forEach(key => {
        shader.uniforms[key] = uniforms[key]
      })
      shader.vertexShader = `
        uniform sampler2D uTexturePosition;
        uniform sampler2D uOldTexturePosition;
        uniform sampler2D uTextureVelocity;
        uniform vec3 uFishScale;
        uniform float uFishDisplacementScale;
        attribute vec2 gpuUv;
        attribute float mapIndex;
        varying vec4 vPos;
        varying vec4 vVel;
        varying float vMapIndex;

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
      shader.vertexShader = shader.vertexShader.replace('#include <defaultnormal_vertex>', '')
      shader.vertexShader = shader.vertexShader.replace('#include <normal_vertex>', '')
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        vPos = texture2D(uTexturePosition, gpuUv);
        vec4 oldPos = texture2D(uOldTexturePosition, gpuUv);
        vVel = texture2D(uTextureVelocity, gpuUv);
        vMapIndex = float(mapIndex);

        mat3 rmat = lookAt(oldPos.xyz, vPos.xyz, vec3(0, 1, 0));
        mat4 im = iMatrix(vPos.xyz, rmat, (0.5 + vPos.w) * uFishScale);

        vec3 transformed = vec3(position);

        #ifdef COMPUTE_NORMALS
          vec3 transformedNormal = objectNormal; 
        #endif

        float dz = transformed.z + 1.0;
        float sdz = smoothstep(2.0, 0.0, dz);
        transformed.x += sin(vVel.w + dz * PI * 1.5) * sdz * uFishDisplacementScale;

        #ifdef COMPUTE_NORMALS
          float dz1 = dz - 0.2;
          float sdz1 = smoothstep(2.0, 0.0, dz1);
          float dx1 = sin(vVel.w + dz1 * PI * 1.5) * sdz1 * uFishDisplacementScale - transformed.x;
          vec3 v1 = vec3(dx1, 0.0, -FISH_DZ);
          vec3 v2 = vec3(0.0, 1.0, 0.0);
          transformedNormal = normalize(cross(v1, v2));
        #endif

        #ifdef COMPUTE_NORMALS
          #ifdef USE_INSTANCING
            mat3 m = mat3( im );
            transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
            transformedNormal = m * transformedNormal;
          #endif
          transformedNormal = normalMatrix * transformedNormal;
          #ifdef FLIP_SIDED
            transformedNormal = - transformedNormal;
          #endif
          #ifdef USE_TANGENT
            vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
            #ifdef FLIP_SIDED
              transformedTangent = - transformedTangent;
            #endif
          #endif
          #ifndef FLAT_SHADED
            vNormal = normalize( transformedNormal );
            #ifdef USE_TANGENT
              vTangent = normalize( transformedTangent );
              vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
            #endif
          #endif
        #endif
      `)

      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          mvPosition = im * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
      `)

      shader.fragmentShader = `
        varying float vMapIndex;
      ` + shader.fragmentShader
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
        #ifdef USE_MAP
          vec2 uv = vUv;
          uv.x = (vMapIndex + vUv.x) / TEXTURE_COUNT;
          vec4 sampledDiffuseColor = texture2D(map, uv);
          diffuseColor *= sampledDiffuseColor;
        #endif
      `)
    }

    switch (config.material) {
      case 'standard' :
        material = new MeshStandardMaterial(materialParams)
        break
      case 'phong' :
        material = new MeshPhongMaterial(materialParams)
        break
      default :
        material = new MeshBasicMaterial(materialParams)
    }

    iMesh = new InstancedMesh(geometry, material, COUNT)
    setColors(config.colors)
    scene.add(iMesh)
  }

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
    const posArray = texturePosition.image.data
    const velArray = textureVelocity.image.data
    for (let k = 0, kl = posArray.length; k < kl; k += 4) {
      posArray[k + 0] = rndFS(100)
      posArray[k + 1] = rndFS(100)
      posArray[k + 2] = rndFS(100)
      posArray[k + 3] = rnd(0.1, 1)

      velArray[k + 0] = rndFS(0.5)
      velArray[k + 1] = rndFS(0.5)
      velArray[k + 2] = rndFS(0.5)
      velArray[k + 3] = 0
    }
  }
}
