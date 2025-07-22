/**
 *
 */
function zero() {
  return [0, 0];
}
function one() {
  return [1, 1];
}
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}
function addValue(a, n) {
  return [a[0] + n, a[1] + n];
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}
function subValue(a, n) {
  return [a[0] - n, a[1] - n];
}
function scale(a, n) {
  return [a[0] * n, a[1] * n];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Calculate the squared length of a vector.
 * Use this when comparing two vectors instead of length, as it's more efficient (no sqrt)
 */

function lengthSqr(a) {
  return a[0] * a[0] + a[1] * a[1];
}
/**
 * Calculate the length of a vector.
 * If you only need to compare lenghts, consider using the more efficient lengthSqr
 */

function length(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
function distance(a, b) {
  return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}

var vector2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  zero: zero,
  one: one,
  add: add,
  addValue: addValue,
  sub: sub,
  subValue: subValue,
  scale: scale,
  dot: dot,
  lengthSqr: lengthSqr,
  length: length,
  distance: distance
});

export { add as a, addValue as b, subValue as c, scale as d, dot as e, length as f, distance as g, lengthSqr as l, one as o, sub as s, vector2 as v, zero as z };
