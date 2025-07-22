import { Vector2 } from 'three'

/**
 * Pointer helper
 * @author Kevin Levron <kevin.levron@gmail.com>
 */
export default function (params) {
  const {
    domElement,
    onClick = () => {},
    onEnter = () => {},
    onMove = () => {},
    onLeave = () => {},
    onDragStart = () => {},
    onDragMove = () => {},
    onDragStop = () => {}
  } = params

  const position = new Vector2()
  const nPosition = new Vector2()
  const startPosition = new Vector2()
  const lastPosition = new Vector2()
  const delta = new Vector2()

  const obj = { position, nPosition, hover: false, down: false, removeListeners }

  addListeners()

  return obj

  function pointerClick (e) {
    if (startPosition.distanceTo(position) < 20) {
      // console.log('pointerClick')
      updatePosition(e)
      onClick({ position, nPosition })
    }
  }

  function pointerEnter (e) {
    // console.log('pointerEnter', e)
    obj.hover = e.pointerType === 'mouse'
    updatePosition(e)
    onEnter({ position, nPosition })
  }

  function pointerDown (e) {
    // console.log('pointerDown')
    obj.down = true
    updatePosition(e)
    startPosition.copy(position)
    lastPosition.copy(position)
    onDragStart({ position, nPosition })
  }

  function pointerMove (e) {
    // console.log('pointerMove')
    updatePosition(e)
    delta.copy(position).sub(lastPosition)
    if (obj.down) {
      onDragMove({ position, nPosition, startPosition, lastPosition, delta })
    } else {
      if (!obj.hover) obj.hover = true
    }
    onMove({ position, nPosition, startPosition, lastPosition, delta })
    lastPosition.copy(position)
  }

  function pointerUp (e) {
    // console.log('pointerUp')
    obj.down = false
    onDragStop()
  }

  function pointerLeave (e) {
    // console.log('pointerLeave')
    if (obj.down) {
      obj.down = false
      onDragStop()
    }
    obj.hover = false
    onLeave()
  }

  function updatePosition (e) {
    const rect = domElement.getBoundingClientRect()
    position.x = e.clientX - rect.left
    position.y = e.clientY - rect.top
    nPosition.x = (position.x / rect.width) * 2 - 1
    nPosition.y = -(position.y / rect.height) * 2 + 1
  }

  function addListeners () {
    domElement.addEventListener('click', pointerClick)
    domElement.addEventListener('pointerenter', pointerEnter)
    domElement.addEventListener('pointerdown', pointerDown)
    domElement.addEventListener('pointermove', pointerMove)
    domElement.addEventListener('pointerup', pointerUp)
    domElement.addEventListener('pointerleave', pointerLeave)
  }

  function removeListeners () {
    domElement.removeEventListener('click', pointerClick)
    domElement.removeEventListener('pointerenter', pointerEnter)
    domElement.removeEventListener('pointerdown', pointerDown)
    domElement.removeEventListener('pointermove', pointerMove)
    domElement.removeEventListener('pointerup', pointerUp)
    domElement.removeEventListener('pointerleave', pointerLeave)
  }
}
