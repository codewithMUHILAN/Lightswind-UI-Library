'use strict';

/**
 *
 */
function zero() {
  return [0, 0, 0];
}
function one() {
  return [1, 1, 1];
}
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function addValue(a, n) {
  return [a[0] + n, a[1] + n, a[2] + n];
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function subValue(a, n) {
  return [a[0] - n, a[1] - n, a[2] - n];
}
function scale(a, n) {
  return [a[0] * n, a[1] * n, a[2] * n];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a, b) {
  var x = a[1] * b[2] - a[2] * b[1];
  var y = a[2] * b[0] - a[0] * b[2];
  var z = a[0] * b[1] - a[1] * b[0];
  return [x, y, z];
}
/**
 * Calculate the squared length of a vector.
 * Use this when comparing two vectors instead of length, as it's more efficient (no sqrt)
 */

function lengthSqr(a) {
  return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
}
/**
 * Calculate the length of a vector.
 * If you only need to compare lenghts, consider using the more efficient lengthSqr
 */

function length(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
function distance(a, b) {
  return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]));
}

var vector3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  zero: zero,
  one: one,
  add: add,
  addValue: addValue,
  sub: sub,
  subValue: subValue,
  scale: scale,
  dot: dot,
  cross: cross,
  lengthSqr: lengthSqr,
  length: length,
  distance: distance
});

exports.add = add;
exports.addValue = addValue;
exports.cross = cross;
exports.distance = distance;
exports.dot = dot;
exports.length = length;
exports.lengthSqr = lengthSqr;
exports.one = one;
exports.scale = scale;
exports.sub = sub;
exports.subValue = subValue;
exports.vector3 = vector3;
exports.zero = zero;
