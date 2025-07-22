import { d as doThreePointsMakeARight, a as _toConsumableArray, _ as _slicedToArray } from './triangle-b62b9067.esm.js';
import { Vector3, Matrix3 } from 'three';
import { a as matrixSum3 } from './matrix-baa530bf.esm.js';

/**
 * Clamps a value between a range.
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
} // Loops the value t, so that it is never larger than length and never smaller than 0.

function repeat(t, length) {
  return clamp(t - Math.floor(t / length) * length, 0, length);
} // Calculates the shortest difference between two given angles.

function deltaAngle(current, target) {
  var delta = repeat(target - current, Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  return delta;
}
/**
 * Converts degrees to radians.
 */

function degToRad(degrees) {
  return degrees / 180 * Math.PI;
}
/**
 * Converts radians to degrees.
 */

function radToDeg(radians) {
  return radians * 180 / Math.PI;
} // adapted from https://gist.github.com/stephanbogner/a5f50548a06bec723dcb0991dcbb0856 by https://twitter.com/st_phan

function fibonacciOnSphere(buffer, _ref) {
  var _ref$radius = _ref.radius,
      radius = _ref$radius === void 0 ? 1 : _ref$radius;
  var samples = buffer.length / 3;
  var offset = 2 / samples;
  var increment = Math.PI * (3 - 2.2360679775);

  for (var i = 0; i < buffer.length; i += 3) {
    var y = i * offset - 1 + offset / 2;
    var distance = Math.sqrt(1 - Math.pow(y, 2));
    var phi = i % samples * increment;
    var x = Math.cos(phi) * distance;
    var z = Math.sin(phi) * distance;
    buffer[i] = x * radius;
    buffer[i + 1] = y * radius;
    buffer[i + 2] = z * radius;
  }
} // @ts-ignore

function vectorEquals(a, b) {
  var eps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.EPSILON;
  return Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps && Math.abs(a.z - b.z) < eps;
}
/**
 * Sorts vectors in lexicographic order, works with both v2 and v3
 *
 *  Use as:
 *  const sorted = arrayOfVectors.sort(lexicographicOrder)
 */
// https://en.wikipedia.org/wiki/Lexicographic_order

function lexicographic(a, b) {
  if (a.x === b.x) {
    // do a check to see if points is 3D,
    // in which case add y eq check and sort by z
    if (typeof a.z !== "undefined") {
      if (a.y === b.y) {
        return a.z - b.z;
      }
    }

    return a.y - b.y;
  }

  return a.x - b.x;
}
/**
 * Convex Hull
 *
 * Returns an array of 2D Vectors representing the convex hull of a set of 2D Vectors
 */

/**
 * Calculate the convex hull of a set of points
 */

function convexHull(_points) {
  var points = _points.sort(lexicographic); // put p1 and p2 in a list lUpper with p1 as the first point


  var lUpper = [points[0], points[1]]; // for i <- 3 to n

  for (var i = 2; i < points.length; i++) {
    lUpper.push(points[i]); // while lUpper contains more than 2 points and the last three points in lUpper do not make a right turn

    while (lUpper.length > 2 && doThreePointsMakeARight(_toConsumableArray(lUpper.slice(-3)))) {
      // delete the middle of the last three points from lUpper
      lUpper.splice(lUpper.length - 2, 1);
    }
  } // put pn and pn-1 in a list lLower with pn as the first point


  var lLower = [points[points.length - 1], points[points.length - 2]]; // for (i <- n - 2 downto 1)

  for (var _i = points.length - 3; _i >= 0; _i--) {
    // append pi to lLower
    lLower.push(points[_i]); // while lLower contains more than 2 points and the last three points in lLower do not make a right turn

    while (lLower.length > 2 && doThreePointsMakeARight(_toConsumableArray(lLower.slice(-3)))) {
      // delete the middle of the last three points from lLower
      lLower.splice(lLower.length - 2, 1);
    }
  } // remove the first and last point from lLower to avoid duplication of the points where the upper and lower hull meet


  lLower.splice(0, 1);
  lLower.splice(lLower.length - 1, 1); // prettier-ignore

  var c = [].concat(lUpper, lLower);
  return c;
}
function remap(x, _ref2, _ref3) {
  var _ref4 = _slicedToArray(_ref2, 2),
      low1 = _ref4[0],
      high1 = _ref4[1];

  var _ref5 = _slicedToArray(_ref3, 2),
      low2 = _ref5[0],
      high2 = _ref5[1];

  return low2 + (x - low1) * (high2 - low2) / (high1 - low1);
}
/**
 *
 * https://www.desmos.com/calculator/vsnmlaljdu
 *
 * Ease-in-out, goes to -Infinite before 0 and Infinite after 1
 *
 * @param t
 * @returns
 */

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
/**
 *
 * Returns the result of linearly interpolating between input A and input B by input T.
 *
 * @param v0
 * @param v1
 * @param t
 * @returns
 */

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}
/**
 *
 * Returns the linear parameter that produces the interpolant specified by input T within the range of input A to input B.
 *
 * @param v0
 * @param v1
 * @param t
 * @returns
 */

function inverseLerp(v0, v1, t) {
  return (t - v0) / (v1 - v0);
}
/**
 *
 */

function normalize(x, y, z) {
  var m = Math.sqrt(x * x + y * y + z * z);
  return [x / m, y / m, z / m];
}
/**
 *
 */

function pointOnCubeToPointOnSphere(x, y, z) {
  var x2 = x * x;
  var y2 = y * y;
  var z2 = z * z;
  var nx = x * Math.sqrt(1 - (y2 + z2) / 2 + y2 * z2 / 3);
  var ny = y * Math.sqrt(1 - (z2 + x2) / 2 + z2 * x2 / 3);
  var nz = z * Math.sqrt(1 - (x2 + y2) / 2 + x2 * y2 / 3);
  return [nx, ny, nz];
} // https://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d

/**
 * Give two unit vectors a and b, returns the transformation matrix that rotates a onto b.
 *
 * */

function rotateVectorOnVector(a, b) {
  var v = new Vector3().crossVectors(a, b);
  var c = a.dot(b);
  var i = new Matrix3().identity(); //  skew-symmetric cross-product matrix of 𝑣 https://en.wikipedia.org/wiki/Skew-symmetric_matrix
  // prettier-ignore

  var vx = new Matrix3().set(0, -v.z, v.y, v.z, 0, -v.x, -v.y, v.x, 0);
  var vxsquared = new Matrix3().multiplyMatrices(vx, vx).multiplyScalar(1 / (1 + c));

  var _final = matrixSum3(matrixSum3(i, vx), vxsquared);

  return _final;
} // calculate latitude and longitude (in radians) from point on unit sphere

function pointToCoordinate(x, y, z) {
  var lat = Math.asin(y);
  var lon = Math.atan2(x, -z);
  return [lat, lon];
} // calculate point on unit sphere given latitude and logitude in radians

function coordinateToPoint(lat, lon) {
  var y = Math.sin(lat);
  var r = Math.cos(lat);
  var x = Math.sin(lon) * r;
  var z = -Math.cos(lon) * r;
  return [x, y, z];
}
/**
 * Given a plane and a segment, return the intersection point if it exists or null it doesn't.
 */

function planeSegmentIntersection(plane, segment) {
  var _segment = _slicedToArray(segment, 2),
      a = _segment[0],
      b = _segment[1];

  var matrix = rotateVectorOnVector(plane.normal, new Vector3(0, 1, 0));
  var t = inverseLerp(a.clone().applyMatrix3(matrix).y, b.clone().applyMatrix3(matrix).y, 0);
  return new Vector3().lerpVectors(a, b, t);
}
/**
 * Given a plane and a point, return the distance.
 */

function pointToPlaneDistance(p, plane) {
  var d = plane.normal.dot(p); // TODO

  return d;
}
function getIndexFrom3D(coords, sides) {
  var _coords = _slicedToArray(coords, 3),
      ix = _coords[0],
      iy = _coords[1],
      iz = _coords[2];

  var _sides = _slicedToArray(sides, 2),
      rx = _sides[0],
      ry = _sides[1];

  return iz * rx * ry + iy * rx + ix;
}
function get3DFromIndex(index, size) {
  var _size = _slicedToArray(size, 2),
      rx = _size[0],
      ry = _size[1];

  var a = rx * ry;
  var z = index / a;
  var b = index - a * z;
  var y = b / rx;
  var x = b % rx;
  return [x, y, z];
}
function getIndexFrom2D(coords, size) {
  return coords[0] + size[0] * coords[1];
}
function get2DFromIndex(index, columns) {
  var x = index % columns;
  var y = Math.floor(index / columns);
  return [x, y];
}

var misc = /*#__PURE__*/Object.freeze({
  __proto__: null,
  clamp: clamp,
  repeat: repeat,
  deltaAngle: deltaAngle,
  degToRad: degToRad,
  radToDeg: radToDeg,
  fibonacciOnSphere: fibonacciOnSphere,
  vectorEquals: vectorEquals,
  lexicographic: lexicographic,
  convexHull: convexHull,
  remap: remap,
  fade: fade,
  lerp: lerp,
  inverseLerp: inverseLerp,
  normalize: normalize,
  pointOnCubeToPointOnSphere: pointOnCubeToPointOnSphere,
  rotateVectorOnVector: rotateVectorOnVector,
  pointToCoordinate: pointToCoordinate,
  coordinateToPoint: coordinateToPoint,
  planeSegmentIntersection: planeSegmentIntersection,
  pointToPlaneDistance: pointToPlaneDistance,
  getIndexFrom3D: getIndexFrom3D,
  get3DFromIndex: get3DFromIndex,
  getIndexFrom2D: getIndexFrom2D,
  get2DFromIndex: get2DFromIndex
});

export { degToRad as a, radToDeg as b, clamp as c, deltaAngle as d, fibonacciOnSphere as e, fade as f, lexicographic as g, convexHull as h, remap as i, inverseLerp as j, rotateVectorOnVector as k, lerp as l, misc as m, normalize as n, pointToCoordinate as o, pointOnCubeToPointOnSphere as p, coordinateToPoint as q, repeat as r, planeSegmentIntersection as s, pointToPlaneDistance as t, getIndexFrom3D as u, vectorEquals as v, get3DFromIndex as w, getIndexFrom2D as x, get2DFromIndex as y };
