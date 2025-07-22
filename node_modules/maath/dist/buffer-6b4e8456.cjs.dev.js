'use strict';

var objectSpread2 = require('./objectSpread2-32cd2c34.cjs.dev.js');
var triangle_dist_maathTriangle = require('./triangle-33ffdfef.cjs.dev.js');
var THREE = require('three');
var misc_dist_maathMisc = require('./misc-fce4d494.cjs.dev.js');
var vector2_dist_maathVector2 = require('./vector2-f44fd63e.cjs.dev.js');
var vector3_dist_maathVector3 = require('./vector3-5e723d1a.cjs.dev.js');

function swizzle(buffer) {
  var stride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var swizzle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "xyz";
  var o = {
    x: 0,
    y: 0,
    z: 0
  };

  for (var _i = 0; _i < buffer.length; _i += stride) {
    o.x = buffer[_i];
    o.y = buffer[_i + 1];
    o.z = buffer[_i + 2];

    var _swizzle$split = swizzle.split(""),
        _swizzle$split2 = triangle_dist_maathTriangle._slicedToArray(_swizzle$split, 3),
        x = _swizzle$split2[0],
        y = _swizzle$split2[1],
        z = _swizzle$split2[2]; // TODO Fix this ugly type


    buffer[_i] = o[x];
    buffer[_i + 1] = o[y];

    if (stride === 3) {
      buffer[_i + 2] = o[z];
    }
  }

  return buffer;
}
/**
 * @param buffer A stride 2 points buffer
 * @param valueGenerator A function that returns the value of the z axis at index i
 * @returns
 */

function addAxis(buffer, size) {
  var valueGenerator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return Math.random();
  };
  var newSize = size + 1;
  var newBuffer = new Float32Array(buffer.length / size * newSize);

  for (var _i2 = 0; _i2 < buffer.length; _i2 += size) {
    var _j = _i2 / size * newSize;

    newBuffer[_j] = buffer[_i2];
    newBuffer[_j + 1] = buffer[_i2 + 1];

    if (size === 2) {
      newBuffer[_j + 2] = valueGenerator(_j);
    }

    if (size === 3) {
      newBuffer[_j + 2] = buffer[_i2 + 2];
      newBuffer[_j + 3] = valueGenerator(_j);
    }
  }

  return newBuffer;
}
/**
 * Lerps bufferA and bufferB into final
 *
 * @param bufferA
 * @param bufferB
 * @param final
 * @param t
 */

function lerp(bufferA, bufferB, _final, t) {
  for (var _i3 = 0; _i3 < bufferA.length; _i3++) {
    _final[_i3] = misc_dist_maathMisc.lerp(bufferA[_i3], bufferB[_i3], t);
  }
} // TODO add stride
// TODO Fix types & vectors

/**
 *
 * Translate all points in the passed buffer by the passed translactionVector.
 *
 * @param buffer
 * @param translationVector
 * @returns
 */

function translate(buffer, translationVector) {
  var stride = translationVector.length;

  for (var _i4 = 0; _i4 < buffer.length; _i4 += stride) {
    buffer[_i4] += translationVector[0];
    buffer[_i4 + 1] += translationVector[1];
    buffer[_i4 + 2] += translationVector[2];
  }

  return buffer;
} // TODO add stride
// TODO remove quaternion & vector3 dependencies

function rotate(buffer, rotation) {
  var defaultRotation = {
    center: [0, 0, 0],
    q: new THREE.Quaternion().identity()
  };
  var v = new THREE.Vector3();

  var _defaultRotation$rota = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultRotation), rotation),
      q = _defaultRotation$rota.q,
      center = _defaultRotation$rota.center;

  for (var _i5 = 0; _i5 < buffer.length; _i5 += 3) {
    v.set(buffer[_i5] - center[0], buffer[_i5 + 1] - center[1], buffer[_i5 + 2] - center[2]);
    v.applyQuaternion(q);
    buffer[_i5] = v.x + center[0];
    buffer[_i5 + 1] = v.y + center[1];
    buffer[_i5 + 2] = v.z + center[1];
  }

  return buffer;
}
function map(buffer, stride, callback) {
  for (var _i6 = 0, _j2 = 0; _i6 < buffer.length; _i6 += stride, _j2++) {
    if (stride === 3) {
      var res = callback([buffer[_i6], buffer[_i6 + 1], buffer[_i6 + 2]], _j2);
      buffer.set(res, _i6);
    } else {
      buffer.set(callback([buffer[_i6], buffer[_i6 + 1]], _j2), _i6);
    }
  }

  return buffer;
}
/**
 * Reduces passed buffer
 */

function reduce(b, stride, callback, acc) {
  for (var _i7 = 0, _j3 = 0; _i7 < b.length; _i7 += stride, _j3++) {
    if (stride === 2) {
      acc = callback(acc, [b[_i7], b[_i7 + 1]], _j3);
    } else {
      acc = callback(acc, [b[_i7], b[_i7 + 1], b[_i7 + 2]], _j3);
    }
  }

  return acc;
}
function expand(b, stride, opts) {
  var defaultExpandOptions = {
    center: [0, 0, 0]
  };

  var _defaultExpandOptions = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultExpandOptions), opts),
      center = _defaultExpandOptions.center,
      distance = _defaultExpandOptions.distance;

  for (var _i8 = 0; _i8 < b.length; _i8 += stride) {
    /**
     * 1. translate to origin (subtract the scaling center)
     * 2. scale by the correct amount (multiply by a constant)
     * 2. translate from origin (add the scaling center)
     */
    b[_i8] = (b[_i8] - center[0]) * (1 + distance) + center[0];
    b[_i8 + 1] = (b[_i8 + 1] - center[1]) * (1 + distance) + center[1];

    if (stride === 3) {
      b[_i8 + 2] = (b[_i8 + 2] - center[1]) * (1 + distance) + center[2];
    }
  }

  return b;
}
function center(myBuffer, stride) {
  return reduce(myBuffer, stride, function (acc, point) {
    if (stride === 3) {
      // some type hacking is necessary to avoid type errors going from [n, n] => [n, n, n]
      // but it's not an actual problem, as this path would always get a v3
      acc = vector3_dist_maathVector3.add(acc, point);
    } else {
      acc = vector2_dist_maathVector2.add(acc, point);
    }

    return acc;
  }, vector2_dist_maathVector2.zero());
}
function sort(myBuffer, stride, callback) {
  // 1. make an array of the correct size
  var indices = Int16Array.from({
    length: myBuffer.length / stride
  }, function (_, i) {
    return i;
  }); // 2. sort the indices array

  indices.sort(function (a, b) {
    var pa = myBuffer.slice(a * stride, a * stride + stride);
    var pb = myBuffer.slice(b * stride, b * stride + stride);
    return callback(pa, pb);
  }); // 3. make a copy of the original array to fetch indices from

  var prevBuffer = myBuffer.slice(0); // 4. mutate the passed array

  for (var _i9 = 0; _i9 < indices.length; _i9++) {
    var _j4 = indices[_i9];
    myBuffer.set(prevBuffer.slice(_j4 * stride, _j4 * stride + stride), _i9 * 3);
  }

  return myBuffer;
}

var buffer = /*#__PURE__*/Object.freeze({
  __proto__: null,
  swizzle: swizzle,
  addAxis: addAxis,
  lerp: lerp,
  translate: translate,
  rotate: rotate,
  map: map,
  reduce: reduce,
  expand: expand,
  center: center,
  sort: sort
});

exports.addAxis = addAxis;
exports.buffer = buffer;
exports.center = center;
exports.expand = expand;
exports.lerp = lerp;
exports.map = map;
exports.reduce = reduce;
exports.rotate = rotate;
exports.sort = sort;
exports.swizzle = swizzle;
exports.translate = translate;
