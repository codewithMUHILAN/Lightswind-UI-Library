import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import pointer from './pointer'

export default function (params) {
  const options = {
    el: null,
    canvas: null,
    eventsEl: null,
    width: null,
    height: null,
    resize: true,
    alpha: false,
    antialias: false,
    orbitControls: false,
    init () {},
    initCamera () {},
    initScene () {},
    afterResize () {},
    beforeRender () {},
    ...params
  }

  const three = {
    renderer: null,
    camera: null,
    scene: null,
    pointer: null,
    width: 0,
    height: 0,
    wWidth: 0,
    wHeight: 0,
    clock: {
      startTime: 0,
      time: 0,
      elapsed: 0
    },
    options
  }

  let render

  let cameraCtrl

  init()

  return three

  function init () {
    let canvas
    if (options.el) {
      canvas = document.createElement('canvas')
      options.el.appendChild(canvas)
    } else if (options.canvas) {
      canvas = options.canvas
    } else {
      throw new Error('Missing parameter : el or canvas is required')
    }

    options.init?.(three)

    three.renderer = new WebGLRenderer({ canvas, alpha: options.alpha, antialias: options.antialias })
    options.initRenderer?.(three)

    three.camera = new PerspectiveCamera()
    three.camera.position.z = 50
    options.initCamera?.(three)

    if (options.orbitControls) {
      cameraCtrl = new OrbitControls(three.camera, options.eventsEl ?? three.renderer.domElement)
      cameraCtrl.enableDamping = true
      cameraCtrl.dampingFactor = 0.1
      if (typeof options.orbitControls === 'object') {
        Object.keys(options.orbitControls).forEach(key => {
          cameraCtrl[key] = options.orbitControls[key]
        })
      }
    }

    resize()
    if (options.resize && !options.width && !options.height) {
      window.addEventListener('resize', resize)
    }

    three.scene = new Scene()
    options.initScene?.(three)

    initPointer()

    render = options.render ? options.render : () => { three.renderer.render(three.scene, three.camera) }

    requestAnimationFrame(timestamp => {
      three.clock.startTime = three.clock.time = timestamp
      requestAnimationFrame(animate)
    })
  }

  function initPointer () {
    const pointerOptions = {}
    if (options.onPointerEnter) { pointerOptions.onEnter = options.onPointerEnter }
    if (options.onPointerMove) { pointerOptions.onMove = options.onPointerMove }
    if (options.onPointerMove) { pointerOptions.onLeave = options.onPointerLeave }
    if (Object.keys(pointerOptions).length > 0) {
      three.pointer = pointer({ domElement: options.eventsEl ?? (options.el ?? options.canvas), ...pointerOptions })
    }
  }

  function animate (timestamp) {
    const { clock } = three
    clock.elapsed = timestamp - clock.time
    clock.time = timestamp

    options.beforeRender(three)

    if (cameraCtrl) cameraCtrl.update()

    render(three)
    requestAnimationFrame(animate)
  }

  function resize () {
    if (options.width && options.height) {
      three.width = options.width
      three.height = options.height
    } else if (options.resize === 'window') {
      three.width = window.innerWidth
      three.height = window.innerHeight
    } else {
      const parent = three.renderer.domElement.parentElement
      three.width = parent.clientWidth
      three.height = parent.clientHeight
    }

    three.renderer.setSize(three.width, three.height)
    three.camera.aspect = three.width / three.height
    three.camera.updateProjectionMatrix()
    if (three.camera instanceof PerspectiveCamera) {
      const wsize = getCameraViewSize()
      three.wWidth = wsize[0]; three.wHeight = wsize[1]
    } else {
      three.wWidth = three.camera.top - three.camera.bottom
      three.wHeight = three.camera.right - three.camera.left
    }
    options.afterResize?.(three)
  }

  function getCameraViewSize () {
    const vFOV = (three.camera.fov * Math.PI) / 180
    const h = 2 * Math.tan(vFOV / 2) * Math.abs(three.camera.position.z)
    const w = h * three.camera.aspect
    return [w, h]
  }
}

export function commonConfig (params) {
  const config = {}
  const keys = ['el', 'canvas', 'eventsEl', 'width', 'height', 'resize', 'orbitControls']
  keys.forEach(key => {
    if (params[key] !== undefined) config[key] = params[key]
  })
  return config
}

export function initLights (scene, lightsConfig) {
  const lights = []
  if (Array.isArray(lightsConfig) && lightsConfig.length > 0) {
    let light
    lightsConfig.forEach(lightConfig => {
      switch (lightConfig.type) {
        case 'ambient':
          light = new AmbientLight(...lightConfig.params)
          break
        case 'directional':
          light = new DirectionalLight(...lightConfig.params)
          break
        case 'point':
          light = new PointLight(...lightConfig.params)
          break
        default:
          console.error(`Unknown light type ${lightConfig.type}`)
      }
      if (light) {
        if (typeof lightConfig.props === 'object') {
          Object.keys(lightConfig.props).forEach(key => {
            if (key === 'position') {
              light.position.set(...lightConfig.props[key])
            } else light[key] = lightConfig.props[key]
          })
        }
        scene.add(light)
        lights.push(light)
      }
    })
  }
  return lights
}
