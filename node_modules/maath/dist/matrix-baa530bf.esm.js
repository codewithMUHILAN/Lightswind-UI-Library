import { Matrix3 } from 'three';

/**
 *
 * @param terms
 *
 * | a b |
 * | c d |
 *
 * @returns {number} determinant
 */

function determinant2() {
  for (var _len = arguments.length, terms = new Array(_len), _key = 0; _key < _len; _key++) {
    terms[_key] = arguments[_key];
  }

  var a = terms[0],
      b = terms[1],
      c = terms[2],
      d = terms[3];
  return a * d - b * c;
}
/**
 *
 * @param terms
 *
 * | a b c |
 * | d e f |
 * | g h i |
 *
 * @returns {number} determinant
 */

function determinant3() {
  for (var _len2 = arguments.length, terms = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    terms[_key2] = arguments[_key2];
  }

  var a = terms[0],
      b = terms[1],
      c = terms[2],
      d = terms[3],
      e = terms[4],
      f = terms[5],
      g = terms[6],
      h = terms[7],
      i = terms[8];
  return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
}
/**
 *
 * @param terms
 *
 * | a b c g |
 * | h i j k |
 * | l m n o |
 *
 * @returns {number} determinant
 */

function determinant4() {
  for (var _len3 = arguments.length, terms = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    terms[_key3] = arguments[_key3];
  }

  terms[0];
      terms[1];
      terms[2];
      terms[3];
      terms[4];
      terms[5];
      terms[6];
      terms[7];
      terms[8];
      terms[9];
      terms[10];
      terms[11];
      terms[12];
      terms[13];
      terms[14]; // TODO
}
/**
 *
 * Get the determinant of matrix m without row r and col c
 *
 * @param {matrix} m Starter matrix
 * @param r row to remove
 * @param c col to remove
 *
 *     | a b c |
 * m = | d e f |
 *     | g h i |
 *
 * getMinor(m, 1, 1) would result in this determinant
 *
 * | a c |
 * | g i |
 *
 * @returns {number} determinant
 */

function getMinor(matrix, r, c) {
  var _matrixTranspose = matrix.clone().transpose();

  var x = [];
  var l = _matrixTranspose.elements.length;
  var n = Math.sqrt(l);

  for (var i = 0; i < l; i++) {
    var element = _matrixTranspose.elements[i];
    var row = Math.floor(i / n);
    var col = i % n;

    if (row !== r - 1 && col !== c - 1) {
      x.push(element);
    }
  }

  return determinant3.apply(void 0, x);
}
/**
 *
 */

function matrixSum3(m1, m2) {
  var sum = [];
  var m1Array = m1.toArray();
  var m2Array = m2.toArray();

  for (var i = 0; i < m1Array.length; i++) {
    sum[i] = m1Array[i] + m2Array[i];
  }

  return new Matrix3().fromArray(sum);
}

var matrix = /*#__PURE__*/Object.freeze({
  __proto__: null,
  determinant2: determinant2,
  determinant3: determinant3,
  determinant4: determinant4,
  getMinor: getMinor,
  matrixSum3: matrixSum3
});

export { matrixSum3 as a, determinant2 as b, determinant4 as c, determinant3 as d, getMinor as g, matrix as m };
