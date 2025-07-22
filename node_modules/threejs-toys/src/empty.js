import three from './three'

const defaultConfig = {
}

export default function (params) {
  const config = { ...defaultConfig, ...params }

  three({
    el: params.el,
    antialias: false,
    init ({ renderer }) {
    },
    initCamera (three) {
    },
    initScene ({ scene }) {
    },
    afterResize ({ width, height }) {
    },
    beforeRender ({ clock, width, height, wWidth, wHeight }) {
    },
    onPointerMove ({ position, nPosition, delta }) {
    },
    onPointerLeave () {
    }
  })

  return { config }
}
