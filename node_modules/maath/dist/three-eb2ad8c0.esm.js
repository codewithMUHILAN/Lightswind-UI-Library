import { Vector3, Vector2 } from 'three';

/**
 * Helpers for converting buffers to and from Three.js objects
 */

/**
 * Convents passed buffer of passed stride to an array of vectors with the correct length.
 *
 * @param buffer
 * @param stride
 * @returns
 */
function bufferToVectors(buffer) {
  var stride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var p = [];

  for (var i = 0, j = 0; i < buffer.length; i += stride, j++) {
    if (stride === 3) {
      p[j] = new Vector3(buffer[i], buffer[i + 1], buffer[i + 2]);
    } else {
      p[j] = new Vector2(buffer[i], buffer[i + 1]);
    }
  }

  return p;
}
/**
 * Transforms a passed Vector2 or Vector3 array to a points buffer
 *
 * @param vectorArray
 * @returns
 */

function vectorsToBuffer(vectorArray) {
  var l = vectorArray.length;
  var stride = vectorArray[0].hasOwnProperty("z") ? 3 : 2;
  var buffer = new Float32Array(l * stride);

  for (var i = 0; i < l; i++) {
    var j = i * stride;
    buffer[j] = vectorArray[i].x;
    buffer[j + 1] = vectorArray[i].y;

    if (stride === 3) {
      buffer[j + 2] = vectorArray[i].z;
    }
  }

  return buffer;
}

var three = /*#__PURE__*/Object.freeze({
  __proto__: null,
  bufferToVectors: bufferToVectors,
  vectorsToBuffer: vectorsToBuffer
});

export { bufferToVectors as b, three as t, vectorsToBuffer as v };
