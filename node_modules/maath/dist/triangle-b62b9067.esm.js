import { a as _isNativeReflectConstruct, _ as _setPrototypeOf } from './isNativeReflectConstruct-5594d075.esm.js';
import { Vector2, Matrix4 } from 'three';
import { d as determinant3, g as getMinor } from './matrix-baa530bf.esm.js';

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

/**
 *
 * @param point
 *
 * @param triangle
 *
 * @returns {boolean} true if the point is in the triangle
 *
 * TODO: Find explainer
 */
function isPointInTriangle(point, triangle) {
  var _triangle$ = _slicedToArray(triangle[0], 2),
      ax = _triangle$[0],
      ay = _triangle$[1];

  var _triangle$2 = _slicedToArray(triangle[1], 2),
      bx = _triangle$2[0],
      by = _triangle$2[1];

  var _triangle$3 = _slicedToArray(triangle[2], 2),
      cx = _triangle$3[0],
      cy = _triangle$3[1];

  var _point = _slicedToArray(point, 2),
      px = _point[0],
      py = _point[1]; // TODO Sub with static calc


  var matrix = new Matrix4(); // prettier-ignore

  matrix.set(ax, ay, ax * ax + ay * ay, 1, bx, by, bx * bx + by * by, 1, cx, cy, cx * cx + cy * cy, 1, px, py, px * px + py * py, 1);
  return matrix.determinant() <= 0;
}
function triangleDeterminant(triangle) {
  var _triangle$4 = _slicedToArray(triangle[0], 2),
      x1 = _triangle$4[0],
      y1 = _triangle$4[1];

  var _triangle$5 = _slicedToArray(triangle[1], 2),
      x2 = _triangle$5[0],
      y2 = _triangle$5[1];

  var _triangle$6 = _slicedToArray(triangle[2], 2),
      x3 = _triangle$6[0],
      y3 = _triangle$6[1]; // prettier-ignore


  return determinant3(x1, y1, 1, x2, y2, 1, x3, y3, 1);
}
/**
 * Uses triangle area determinant to check if 3 points are collinear.
 * If they are, they can't make a triangle, so the determinant will be 0!
 *
 *      0     1     2
 * ─────■─────■─────■
 *
 *
 * Fun fact, you can use this same determinant to check the order of the points in the triangle
 *
 * NOTE: Should this use a buffer instead? NOTE: Should this use a buffer instead? [x0, y0, x1, y1, x2, y2]?
 *
 */

function arePointsCollinear(points) {
  return triangleDeterminant(points) === 0;
} // TODO This is the same principle as the prev function, find a way to make it have sense

function isTriangleClockwise(triangle) {
  return triangleDeterminant(triangle) < 0;
}
/**
 
The circumcircle is a circle touching all the vertices of a triangle or polygon.

             ┌───┐             
             │ B │             
             └───┘             
           .───●───.           
        ,─'   ╱ ╲   '─.        
      ,'     ╱   ╲     `.      
     ╱      ╱     ╲      ╲     
    ;      ╱       ╲      :    
    │     ╱         ╲     │    
    │    ╱           ╲    │    
    :   ╱             ╲   ;    
     ╲ ╱               ╲ ╱     
┌───┐ ●─────────────────● ┌───┐
│ A │  `.             ,'  │ C │
└───┘    '─.       ,─'    └───┘
            `─────'                         
 */

/**
 *
 * @param triangle
 *
 * @returns {number} circumcircle
 */
// https://math.stackexchange.com/a/1460096

function getCircumcircle(triangle) {
  // TS-TODO the next few lines are ignored because the types aren't current to the change in vectors (that can now be iterated)
  // @ts-ignore
  var _triangle$7 = _slicedToArray(triangle[0], 2),
      ax = _triangle$7[0],
      ay = _triangle$7[1]; // @ts-ignore


  var _triangle$8 = _slicedToArray(triangle[1], 2),
      bx = _triangle$8[0],
      by = _triangle$8[1]; // @ts-ignore


  var _triangle$9 = _slicedToArray(triangle[2], 2),
      cx = _triangle$9[0],
      cy = _triangle$9[1];

  if (arePointsCollinear(triangle)) return null; // points are collinear

  var m = new Matrix4(); // prettier-ignore

  m.set(1, 1, 1, 1, ax * ax + ay * ay, ax, ay, 1, bx * bx + by * by, bx, by, 1, cx * cx + cy * cy, cx, cy, 1);
  var m11 = getMinor(m, 1, 1);
  var m13 = getMinor(m, 1, 3);
  var m12 = getMinor(m, 1, 2);
  var m14 = getMinor(m, 1, 4);
  var x0 = 0.5 * (m12 / m11);
  var y0 = 0.5 * (m13 / m11);
  var r2 = x0 * x0 + y0 * y0 + m14 / m11;
  return {
    x: Math.abs(x0) === 0 ? 0 : x0,
    y: Math.abs(y0) === 0 ? 0 : -y0,
    r: Math.sqrt(r2)
  };
} // https://stackoverflow.com/questions/39984709/how-can-i-check-wether-a-point-is-inside-the-circumcircle-of-3-points

function isPointInCircumcircle(point, triangle) {
  var _ref = Array.isArray(triangle[0]) ? triangle[0] : triangle[0].toArray(),
      _ref2 = _slicedToArray(_ref, 2),
      ax = _ref2[0],
      ay = _ref2[1];

  var _ref3 = Array.isArray(triangle[1]) ? triangle[1] : triangle[1].toArray(),
      _ref4 = _slicedToArray(_ref3, 2),
      bx = _ref4[0],
      by = _ref4[1];

  var _ref5 = Array.isArray(triangle[2]) ? triangle[2] : triangle[2].toArray(),
      _ref6 = _slicedToArray(_ref5, 2),
      cx = _ref6[0],
      cy = _ref6[1];

  var _point2 = _slicedToArray(point, 2),
      px = _point2[0],
      py = _point2[1];

  if (arePointsCollinear(triangle)) throw new Error("Collinear points don't form a triangle");
  /**
          | ax-px, ay-py, (ax-px)² + (ay-py)² |
    det = | bx-px, by-py, (bx-px)² + (by-py)² |
          | cx-px, cy-py, (cx-px)² + (cy-py)² |
  */

  var x1mpx = ax - px;
  var aympy = ay - py;
  var bxmpx = bx - px;
  var bympy = by - py;
  var cxmpx = cx - px;
  var cympy = cy - py; // prettier-ignore

  var d = determinant3(x1mpx, aympy, x1mpx * x1mpx + aympy * aympy, bxmpx, bympy, bxmpx * bxmpx + bympy * bympy, cxmpx, cympy, cxmpx * cxmpx + cympy * cympy); // if d is 0, the point is on C

  if (d === 0) {
    return true;
  }

  return !isTriangleClockwise(triangle) ? d > 0 : d < 0;
} // From https://algorithmtutor.com/Computational-Geometry/Determining-if-two-consecutive-segments-turn-left-or-right/

var mv1 = new Vector2();
var mv2 = new Vector2();
/**
 
     ╱      ╲     
    ╱        ╲    
   ▕          ▏   
                  
 right      left  

 * NOTE: Should this use a buffer instead? [x0, y0, x1, y1]?
 */

function doThreePointsMakeARight(points) {
  var _points$map = points.map(function (p) {
    if (Array.isArray(p)) {
      return _construct(Vector2, _toConsumableArray(p));
    }

    return p;
  }),
      _points$map2 = _slicedToArray(_points$map, 3),
      p1 = _points$map2[0],
      p2 = _points$map2[1],
      p3 = _points$map2[2];

  if (arePointsCollinear(points)) return false; // @ts-ignore

  var p2p1 = mv1.subVectors(p2, p1); // @ts-ignore

  var p3p1 = mv2.subVectors(p3, p1);
  var cross = p3p1.cross(p2p1);
  return cross > 0;
}

var triangle = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isPointInTriangle: isPointInTriangle,
  triangleDeterminant: triangleDeterminant,
  arePointsCollinear: arePointsCollinear,
  isTriangleClockwise: isTriangleClockwise,
  getCircumcircle: getCircumcircle,
  isPointInCircumcircle: isPointInCircumcircle,
  doThreePointsMakeARight: doThreePointsMakeARight
});

export { _slicedToArray as _, _toConsumableArray as a, triangleDeterminant as b, arePointsCollinear as c, doThreePointsMakeARight as d, isTriangleClockwise as e, isPointInCircumcircle as f, getCircumcircle as g, isPointInTriangle as i, triangle as t };
