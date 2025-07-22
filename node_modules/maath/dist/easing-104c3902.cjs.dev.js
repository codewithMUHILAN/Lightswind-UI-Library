'use strict';

var triangle_dist_maathTriangle = require('./triangle-33ffdfef.cjs.dev.js');
var THREE = require('three');
var misc_dist_maathMisc = require('./misc-fce4d494.cjs.dev.js');

var rsqw = function rsqw(t) {
  var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.01;
  var a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var f = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1 / (2 * Math.PI);
  return a / Math.atan(1 / delta) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
};
var exp = function exp(t) {
  return 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t);
};
var linear = function linear(t) {
  return t;
};
var sine = {
  "in": function _in(x) {
    return 1 - Math.cos(x * Math.PI / 2);
  },
  out: function out(x) {
    return Math.sin(x * Math.PI / 2);
  },
  inOut: function inOut(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }
};
var cubic = {
  "in": function _in(x) {
    return x * x * x;
  },
  out: function out(x) {
    return 1 - Math.pow(1 - x, 3);
  },
  inOut: function inOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
};
var quint = {
  "in": function _in(x) {
    return x * x * x * x * x;
  },
  out: function out(x) {
    return 1 - Math.pow(1 - x, 5);
  },
  inOut: function inOut(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }
};
var circ = {
  "in": function _in(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  },
  out: function out(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  },
  inOut: function inOut(x) {
    return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }
};
var quart = {
  "in": function _in(t) {
    return t * t * t * t;
  },
  out: function out(t) {
    return 1 - --t * t * t * t;
  },
  inOut: function inOut(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  }
};
var expo = {
  "in": function _in(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  },
  out: function out(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  },
  inOut: function inOut(x) {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  }
};
/**
 * Damp, based on Game Programming Gems 4 Chapter 1.10
 *   Return value indicates whether the animation is still running.
 */

function damp(
/** The object */
current,
/** The key to animate */
prop,
/** To goal value */
target) {
  var smoothTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;
  var delta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.01;
  var maxSpeed = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Infinity;
  var easing = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : exp;
  var eps = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0.001;
  var vel = "velocity_" + prop;
  if (current.__damp === undefined) current.__damp = {};
  if (current.__damp[vel] === undefined) current.__damp[vel] = 0;

  if (Math.abs(current[prop] - target) <= eps) {
    current[prop] = target;
    return false;
  }

  smoothTime = Math.max(0.0001, smoothTime);
  var omega = 2 / smoothTime;
  var t = easing(omega * delta);
  var change = current[prop] - target;
  var originalTo = target; // Clamp maximum maxSpeed

  var maxChange = maxSpeed * smoothTime;
  change = Math.min(Math.max(change, -maxChange), maxChange);
  target = current[prop] - change;
  var temp = (current.__damp[vel] + omega * change) * delta;
  current.__damp[vel] = (current.__damp[vel] - omega * temp) * t;
  var output = target + (change + temp) * t; // Prevent overshooting

  if (originalTo - current[prop] > 0.0 === output > originalTo) {
    output = originalTo;
    current.__damp[vel] = (output - originalTo) / delta;
  }

  current[prop] = output;
  return true;
}
/**
 * DampLookAt
 */

var isCamera = function isCamera(v) {
  return v && v.isCamera;
};

var isLight = function isLight(v) {
  return v && v.isLight;
};

var vl3d = /*@__PURE__*/new THREE.Vector3();

var _q1 = /*@__PURE__*/new THREE.Quaternion();

var _q2 = /*@__PURE__*/new THREE.Quaternion();

var _m1 = /*@__PURE__*/new THREE.Matrix4();

var _position = /*@__PURE__*/new THREE.Vector3();

function dampLookAt(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  // This method does not support objects having non-uniformly-scaled parent(s)
  if (typeof target === "number") vl3d.setScalar(target);else if (Array.isArray(target)) vl3d.set(target[0], target[1], target[2]);else vl3d.copy(target);
  var parent = current.parent;
  current.updateWorldMatrix(true, false);

  _position.setFromMatrixPosition(current.matrixWorld);

  if (isCamera(current) || isLight(current)) _m1.lookAt(_position, vl3d, current.up);else _m1.lookAt(vl3d, _position, current.up);
  dampQ(current.quaternion, _q2.setFromRotationMatrix(_m1), smoothTime, delta, maxSpeed, easing, eps);

  if (parent) {
    _m1.extractRotation(parent.matrixWorld);

    _q1.setFromRotationMatrix(_m1);

    dampQ(current.quaternion, _q2.copy(current.quaternion).premultiply(_q1.invert()), smoothTime, delta, maxSpeed, easing, eps);
  }
}
/**
 * DampAngle, with a shortest-path
 */

function dampAngle(current, prop, target, smoothTime, delta, maxSpeed, easing, eps) {
  return damp(current, prop, current[prop] + misc_dist_maathMisc.deltaAngle(current[prop], target), smoothTime, delta, maxSpeed, easing, eps);
}
/**
 * Vector2D Damp
 */

var v2d = /*@__PURE__*/new THREE.Vector2();
var a2, b2;
function damp2(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  if (typeof target === "number") v2d.setScalar(target);else if (Array.isArray(target)) v2d.set(target[0], target[1]);else v2d.copy(target);
  a2 = damp(current, "x", v2d.x, smoothTime, delta, maxSpeed, easing, eps);
  b2 = damp(current, "y", v2d.y, smoothTime, delta, maxSpeed, easing, eps);
  return a2 || b2;
}
/**
 * Vector3D Damp
 */

var v3d = /*@__PURE__*/new THREE.Vector3();
var a3, b3, c3;
function damp3(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  if (typeof target === "number") v3d.setScalar(target);else if (Array.isArray(target)) v3d.set(target[0], target[1], target[2]);else v3d.copy(target);
  a3 = damp(current, "x", v3d.x, smoothTime, delta, maxSpeed, easing, eps);
  b3 = damp(current, "y", v3d.y, smoothTime, delta, maxSpeed, easing, eps);
  c3 = damp(current, "z", v3d.z, smoothTime, delta, maxSpeed, easing, eps);
  return a3 || b3 || c3;
}
/**
 * Vector4D Damp
 */

var v4d = /*@__PURE__*/new THREE.Vector4();
var a4, b4, c4, d4;
function damp4(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  if (typeof target === "number") v4d.setScalar(target);else if (Array.isArray(target)) v4d.set(target[0], target[1], target[2], target[3]);else v4d.copy(target);
  a4 = damp(current, "x", v4d.x, smoothTime, delta, maxSpeed, easing, eps);
  b4 = damp(current, "y", v4d.y, smoothTime, delta, maxSpeed, easing, eps);
  c4 = damp(current, "z", v4d.z, smoothTime, delta, maxSpeed, easing, eps);
  d4 = damp(current, "w", v4d.w, smoothTime, delta, maxSpeed, easing, eps);
  return a4 || b4 || c4 || d4;
}

/**
 * Euler Damp
 */
var rot = /*@__PURE__*/new THREE.Euler();
var aE, bE, cE;
function dampE(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  if (Array.isArray(target)) rot.set(target[0], target[1], target[2], target[3]);else rot.copy(target);
  aE = dampAngle(current, "x", rot.x, smoothTime, delta, maxSpeed, easing, eps);
  bE = dampAngle(current, "y", rot.y, smoothTime, delta, maxSpeed, easing, eps);
  cE = dampAngle(current, "z", rot.z, smoothTime, delta, maxSpeed, easing, eps);
  return aE || bE || cE;
}
/**
 * Color Damp
 */

var col = /*@__PURE__*/new THREE.Color();
var aC, bC, cC;
function dampC(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  if (target instanceof THREE.Color) col.copy(target);else if (Array.isArray(target)) col.setRGB(target[0], target[1], target[2]);else col.set(target);
  aC = damp(current, "r", col.r, smoothTime, delta, maxSpeed, easing, eps);
  bC = damp(current, "g", col.g, smoothTime, delta, maxSpeed, easing, eps);
  cC = damp(current, "b", col.b, smoothTime, delta, maxSpeed, easing, eps);
  return aC || bC || cC;
}
/**
 * Quaternion Damp
 * https://gist.github.com/maxattack/4c7b4de00f5c1b95a33b
 * Copyright 2016 Max Kaufmann (max.kaufmann@gmail.com)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var qt = /*@__PURE__*/new THREE.Quaternion();
var v4result = /*@__PURE__*/new THREE.Vector4();
var v4velocity = /*@__PURE__*/new THREE.Vector4();
var v4error = /*@__PURE__*/new THREE.Vector4();
var aQ, bQ, cQ, dQ;
function dampQ(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  var cur = current;
  if (Array.isArray(target)) qt.set(target[0], target[1], target[2], target[3]);else qt.copy(target);
  var multi = current.dot(qt) > 0 ? 1 : -1;
  qt.x *= multi;
  qt.y *= multi;
  qt.z *= multi;
  qt.w *= multi;
  aQ = damp(current, "x", qt.x, smoothTime, delta, maxSpeed, easing, eps);
  bQ = damp(current, "y", qt.y, smoothTime, delta, maxSpeed, easing, eps);
  cQ = damp(current, "z", qt.z, smoothTime, delta, maxSpeed, easing, eps);
  dQ = damp(current, "w", qt.w, smoothTime, delta, maxSpeed, easing, eps); // smooth damp (nlerp approx)

  v4result.set(current.x, current.y, current.z, current.w).normalize();
  v4velocity.set(cur.__damp.velocity_x, cur.__damp.velocity_y, cur.__damp.velocity_z, cur.__damp.velocity_w); // ensure deriv is tangent

  v4error.copy(v4result).multiplyScalar(v4velocity.dot(v4result) / v4result.dot(v4result));
  cur.__damp.velocity_x -= v4error.x;
  cur.__damp.velocity_y -= v4error.y;
  cur.__damp.velocity_z -= v4error.z;
  cur.__damp.velocity_w -= v4error.w;
  current.set(v4result.x, v4result.y, v4result.z, v4result.w);
  return aQ || bQ || cQ || dQ;
}
/**
 * Spherical Damp
 */

var spherical = /*@__PURE__*/new THREE.Spherical();
var aS, bS, cS;
function dampS(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  if (Array.isArray(target)) spherical.set(target[0], target[1], target[2]);else spherical.copy(target);
  aS = damp(current, "radius", spherical.radius, smoothTime, delta, maxSpeed, easing, eps);
  bS = dampAngle(current, "phi", spherical.phi, smoothTime, delta, maxSpeed, easing, eps);
  cS = dampAngle(current, "theta", spherical.theta, smoothTime, delta, maxSpeed, easing, eps);
  return aS || bS || cS;
}
/**
 * Matrix4 Damp
 */

var mat = /*@__PURE__*/new THREE.Matrix4();
var mPos = /*@__PURE__*/new THREE.Vector3();
var mRot = /*@__PURE__*/new THREE.Quaternion();
var mSca = /*@__PURE__*/new THREE.Vector3();
var aM, bM, cM;
function dampM(current, target, smoothTime, delta, maxSpeed, easing, eps) {
  var cur = current;

  if (cur.__damp === undefined) {
    cur.__damp = {
      position: new THREE.Vector3(),
      rotation: new THREE.Quaternion(),
      scale: new THREE.Vector3()
    };
    current.decompose(cur.__damp.position, cur.__damp.rotation, cur.__damp.scale);
  }

  if (Array.isArray(target)) mat.set.apply(mat, triangle_dist_maathTriangle._toConsumableArray(target));else mat.copy(target);
  mat.decompose(mPos, mRot, mSca);
  aM = damp3(cur.__damp.position, mPos, smoothTime, delta, maxSpeed, easing, eps);
  bM = dampQ(cur.__damp.rotation, mRot, smoothTime, delta, maxSpeed, easing, eps);
  cM = damp3(cur.__damp.scale, mSca, smoothTime, delta, maxSpeed, easing, eps);
  current.compose(cur.__damp.position, cur.__damp.rotation, cur.__damp.scale);
  return aM || bM || cM;
}

var easing = /*#__PURE__*/Object.freeze({
  __proto__: null,
  rsqw: rsqw,
  exp: exp,
  linear: linear,
  sine: sine,
  cubic: cubic,
  quint: quint,
  circ: circ,
  quart: quart,
  expo: expo,
  damp: damp,
  dampLookAt: dampLookAt,
  dampAngle: dampAngle,
  damp2: damp2,
  damp3: damp3,
  damp4: damp4,
  dampE: dampE,
  dampC: dampC,
  dampQ: dampQ,
  dampS: dampS,
  dampM: dampM
});

exports.circ = circ;
exports.cubic = cubic;
exports.damp = damp;
exports.damp2 = damp2;
exports.damp3 = damp3;
exports.damp4 = damp4;
exports.dampAngle = dampAngle;
exports.dampC = dampC;
exports.dampE = dampE;
exports.dampLookAt = dampLookAt;
exports.dampM = dampM;
exports.dampQ = dampQ;
exports.dampS = dampS;
exports.easing = easing;
exports.exp = exp;
exports.expo = expo;
exports.linear = linear;
exports.quart = quart;
exports.quint = quint;
exports.rsqw = rsqw;
exports.sine = sine;
