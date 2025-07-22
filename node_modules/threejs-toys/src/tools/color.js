import { Color } from 'three'

export function colorScale (colors) {
  let range = []
  setColors(colors)

  const dummy = new Color()

  return { setColors, getColorAt }

  function setColors (colors) {
    range = []
    colors.forEach(color => {
      range.push(new Color(color))
    })
  }

  function getColorAt (progress) {
    const p = Math.max(0, Math.min(1, progress)) * (colors.length - 1)
    const i1 = Math.floor(p)
    const c1 = range[i1]
    if (i1 === colors.length - 1) {
      return c1.getHex()
    }
    const p1 = p - i1
    const c2 = range[i1 + 1]

    dummy.r = c1.r + p1 * (c2.r - c1.r)
    dummy.g = c1.g + p1 * (c2.g - c1.g)
    dummy.b = c1.b + p1 * (c2.b - c1.b)
    return dummy.clone()
  }
}
