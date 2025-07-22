'use strict';

var classCallCheck = require('./classCallCheck-839aeb3a.cjs.prod.js');
var isNativeReflectConstruct = require('./isNativeReflectConstruct-9acebf01.cjs.prod.js');
var THREE = require('three');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) isNativeReflectConstruct._setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = isNativeReflectConstruct._isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var RoundedPlaneGeometry = /*#__PURE__*/function (_THREE$BufferGeometry) {
  _inherits(RoundedPlaneGeometry, _THREE$BufferGeometry);

  var _super = _createSuper(RoundedPlaneGeometry);

  function RoundedPlaneGeometry() {
    var _this;

    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.2;
    var segments = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 16;

    classCallCheck._classCallCheck(this, RoundedPlaneGeometry);

    _this = _super.call(this);
    _this.parameters = {
      width: width,
      height: height,
      radius: radius,
      segments: segments
    }; // helper const's

    var wi = width / 2 - radius; // inner width

    var hi = height / 2 - radius; // inner height

    var ul = radius / width; // u left

    var ur = (width - radius) / width; // u right

    var vl = radius / height; // v low

    var vh = (height - radius) / height; // v high

    var positions = [wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0];
    var uvs = [ur, vh, ul, vh, ul, vl, ur, vl];
    var n = [3 * (segments + 1) + 3, 3 * (segments + 1) + 4, segments + 4, segments + 5, 2 * (segments + 1) + 4, 2, 1, 2 * (segments + 1) + 3, 3, 4 * (segments + 1) + 3, 4, 0];
    var indices = [n[0], n[1], n[2], n[0], n[2], n[3], n[4], n[5], n[6], n[4], n[6], n[7], n[8], n[9], n[10], n[8], n[10], n[11]];
    var phi, cos, sin, xc, yc, uc, vc, idx;

    for (var i = 0; i < 4; i++) {
      xc = i < 1 || i > 2 ? wi : -wi;
      yc = i < 2 ? hi : -hi;
      uc = i < 1 || i > 2 ? ur : ul;
      vc = i < 2 ? vh : vl;

      for (var j = 0; j <= segments; j++) {
        phi = Math.PI / 2 * (i + j / segments);
        cos = Math.cos(phi);
        sin = Math.sin(phi);
        positions.push(xc + radius * cos, yc + radius * sin, 0);
        uvs.push(uc + ul * cos, vc + vl * sin);

        if (j < segments) {
          idx = (segments + 1) * i + j + 4;
          indices.push(i, idx, idx + 1);
        }
      }
    }

    _this.setIndex(new THREE__namespace.BufferAttribute(new Uint32Array(indices), 1));

    _this.setAttribute("position", new THREE__namespace.BufferAttribute(new Float32Array(positions), 3));

    _this.setAttribute("uv", new THREE__namespace.BufferAttribute(new Float32Array(uvs), 2));

    return _this;
  }

  return RoundedPlaneGeometry;
}(THREE__namespace.BufferGeometry); // Author: https://stackoverflow.com/users/128511/gman
// https://stackoverflow.com/questions/34958072/programmatically-generate-simple-uv-mapping-for-models

function applyCylindricalUV(bufferGeometry) {
  var uvs = [];

  for (var i = 0; i < bufferGeometry.attributes.position.array.length / 3; i++) {
    var x = bufferGeometry.attributes.position.array[i * 3 + 0];
    var y = bufferGeometry.attributes.position.array[i * 3 + 1];
    var z = bufferGeometry.attributes.position.array[i * 3 + 2];
    uvs.push(Math.atan2(x, z) / Math.PI * 0.5 + 0.5, y / Math.PI * 0.5 + 0.5);
  }

  if (bufferGeometry.attributes.uv) delete bufferGeometry.attributes.uv;
  bufferGeometry.setAttribute("uv", new THREE__namespace.Float32BufferAttribute(uvs, 2));
  bufferGeometry.attributes.uv.needsUpdate = true;
  return bufferGeometry;
} // Author: https://stackoverflow.com/users/268905/knee-cola
// https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate

function applySphereUV(bufferGeometry) {
  var uvs = [];
  var vertices = [];

  for (var i = 0; i < bufferGeometry.attributes.position.array.length / 3; i++) {
    var x = bufferGeometry.attributes.position.array[i * 3 + 0];
    var y = bufferGeometry.attributes.position.array[i * 3 + 1];
    var z = bufferGeometry.attributes.position.array[i * 3 + 2];
    vertices.push(new THREE__namespace.Vector3(x, y, z));
  }

  var polarVertices = vertices.map(cartesian2polar);

  for (var _i = 0; _i < polarVertices.length / 3; _i++) {
    var tri = new THREE__namespace.Triangle(vertices[_i * 3 + 0], vertices[_i * 3 + 1], vertices[_i * 3 + 2]);
    var normal = tri.getNormal(new THREE__namespace.Vector3());

    for (var f = 0; f < 3; f++) {
      var vertex = polarVertices[_i * 3 + f];

      if (vertex.theta === 0 && (vertex.phi === 0 || vertex.phi === Math.PI)) {
        var alignedVertice = vertex.phi === 0 ? _i * 3 + 1 : _i * 3 + 0;
        vertex = {
          r: vertex.r,
          phi: vertex.phi,
          theta: polarVertices[alignedVertice].theta
        };
      }

      if (vertex.theta === Math.PI && cartesian2polar(normal).theta < Math.PI / 2) {
        vertex.theta = -Math.PI;
      }

      var canvasPoint = polar2canvas(vertex);
      uvs.push(1 - canvasPoint.x, 1 - canvasPoint.y);
    }
  }

  if (bufferGeometry.attributes.uv) delete bufferGeometry.attributes.uv;
  bufferGeometry.setAttribute("uv", new THREE__namespace.Float32BufferAttribute(uvs, 2));
  bufferGeometry.attributes.uv.needsUpdate = true;
  return bufferGeometry;
}

function cartesian2polar(position) {
  var r = Math.sqrt(position.x * position.x + position.z * position.z + position.y * position.y);
  return {
    r: r,
    phi: Math.acos(position.y / r),
    theta: Math.atan2(position.z, position.x)
  };
}

function polar2canvas(polarPoint) {
  return {
    y: polarPoint.phi / Math.PI,
    x: (polarPoint.theta + Math.PI) / (2 * Math.PI)
  };
} // Author: Alex Khoroshylov (https://stackoverflow.com/users/8742287/alex-khoroshylov)
// https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate


function applyBoxUV(bufferGeometry) {
  bufferGeometry.computeBoundingBox();
  var bboxSize = bufferGeometry.boundingBox.getSize(new THREE__namespace.Vector3());
  var boxSize = Math.min(bboxSize.x, bboxSize.y, bboxSize.z);
  var boxGeometry = new THREE__namespace.BoxGeometry(boxSize, boxSize, boxSize);
  var cube = new THREE__namespace.Mesh(boxGeometry);
  cube.rotation.set(0, 0, 0);
  cube.updateWorldMatrix(true, false);
  var transformMatrix = cube.matrix.clone().invert();
  var uvBbox = new THREE__namespace.Box3(new THREE__namespace.Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2), new THREE__namespace.Vector3(boxSize / 2, boxSize / 2, boxSize / 2));

  _applyBoxUV(bufferGeometry, transformMatrix, uvBbox, boxSize);

  bufferGeometry.attributes.uv.needsUpdate = true;
  return bufferGeometry;
}

function _applyBoxUV(geom, transformMatrix, bbox, bbox_max_size) {
  var coords = [];
  coords.length = 2 * geom.attributes.position.array.length / 3; //maps 3 verts of 1 face on the better side of the cube
  //side of the cube can be XY, XZ or YZ

  var makeUVs = function makeUVs(v0, v1, v2) {
    //pre-rotate the model so that cube sides match world axis
    v0.applyMatrix4(transformMatrix);
    v1.applyMatrix4(transformMatrix);
    v2.applyMatrix4(transformMatrix); //get normal of the face, to know into which cube side it maps better

    var n = new THREE__namespace.Vector3();
    n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();
    n.x = Math.abs(n.x);
    n.y = Math.abs(n.y);
    n.z = Math.abs(n.z);
    var uv0 = new THREE__namespace.Vector2();
    var uv1 = new THREE__namespace.Vector2();
    var uv2 = new THREE__namespace.Vector2(); // xz mapping

    if (n.y > n.x && n.y > n.z) {
      uv0.x = (v0.x - bbox.min.x) / bbox_max_size;
      uv0.y = (bbox.max.z - v0.z) / bbox_max_size;
      uv1.x = (v1.x - bbox.min.x) / bbox_max_size;
      uv1.y = (bbox.max.z - v1.z) / bbox_max_size;
      uv2.x = (v2.x - bbox.min.x) / bbox_max_size;
      uv2.y = (bbox.max.z - v2.z) / bbox_max_size;
    } else if (n.x > n.y && n.x > n.z) {
      uv0.x = (v0.z - bbox.min.z) / bbox_max_size;
      uv0.y = (v0.y - bbox.min.y) / bbox_max_size;
      uv1.x = (v1.z - bbox.min.z) / bbox_max_size;
      uv1.y = (v1.y - bbox.min.y) / bbox_max_size;
      uv2.x = (v2.z - bbox.min.z) / bbox_max_size;
      uv2.y = (v2.y - bbox.min.y) / bbox_max_size;
    } else if (n.z > n.y && n.z > n.x) {
      uv0.x = (v0.x - bbox.min.x) / bbox_max_size;
      uv0.y = (v0.y - bbox.min.y) / bbox_max_size;
      uv1.x = (v1.x - bbox.min.x) / bbox_max_size;
      uv1.y = (v1.y - bbox.min.y) / bbox_max_size;
      uv2.x = (v2.x - bbox.min.x) / bbox_max_size;
      uv2.y = (v2.y - bbox.min.y) / bbox_max_size;
    }

    return {
      uv0: uv0,
      uv1: uv1,
      uv2: uv2
    };
  };

  if (geom.index) {
    // is it indexed buffer geometry?
    for (var vi = 0; vi < geom.index.array.length; vi += 3) {
      var idx0 = geom.index.array[vi];
      var idx1 = geom.index.array[vi + 1];
      var idx2 = geom.index.array[vi + 2];
      var vx0 = geom.attributes.position.array[3 * idx0];
      var vy0 = geom.attributes.position.array[3 * idx0 + 1];
      var vz0 = geom.attributes.position.array[3 * idx0 + 2];
      var vx1 = geom.attributes.position.array[3 * idx1];
      var vy1 = geom.attributes.position.array[3 * idx1 + 1];
      var vz1 = geom.attributes.position.array[3 * idx1 + 2];
      var vx2 = geom.attributes.position.array[3 * idx2];
      var vy2 = geom.attributes.position.array[3 * idx2 + 1];
      var vz2 = geom.attributes.position.array[3 * idx2 + 2];
      var v0 = new THREE__namespace.Vector3(vx0, vy0, vz0);
      var v1 = new THREE__namespace.Vector3(vx1, vy1, vz1);
      var v2 = new THREE__namespace.Vector3(vx2, vy2, vz2);
      var uvs = makeUVs(v0, v1, v2);
      coords[2 * idx0] = uvs.uv0.x;
      coords[2 * idx0 + 1] = uvs.uv0.y;
      coords[2 * idx1] = uvs.uv1.x;
      coords[2 * idx1 + 1] = uvs.uv1.y;
      coords[2 * idx2] = uvs.uv2.x;
      coords[2 * idx2 + 1] = uvs.uv2.y;
    }
  } else {
    for (var _vi = 0; _vi < geom.attributes.position.array.length; _vi += 9) {
      var _vx = geom.attributes.position.array[_vi];
      var _vy = geom.attributes.position.array[_vi + 1];
      var _vz = geom.attributes.position.array[_vi + 2];
      var _vx2 = geom.attributes.position.array[_vi + 3];
      var _vy2 = geom.attributes.position.array[_vi + 4];
      var _vz2 = geom.attributes.position.array[_vi + 5];
      var _vx3 = geom.attributes.position.array[_vi + 6];
      var _vy3 = geom.attributes.position.array[_vi + 7];
      var _vz3 = geom.attributes.position.array[_vi + 8];

      var _v = new THREE__namespace.Vector3(_vx, _vy, _vz);

      var _v2 = new THREE__namespace.Vector3(_vx2, _vy2, _vz2);

      var _v3 = new THREE__namespace.Vector3(_vx3, _vy3, _vz3);

      var _uvs = makeUVs(_v, _v2, _v3);

      var _idx = _vi / 3;

      var _idx2 = _idx + 1;

      var _idx3 = _idx + 2;

      coords[2 * _idx] = _uvs.uv0.x;
      coords[2 * _idx + 1] = _uvs.uv0.y;
      coords[2 * _idx2] = _uvs.uv1.x;
      coords[2 * _idx2 + 1] = _uvs.uv1.y;
      coords[2 * _idx3] = _uvs.uv2.x;
      coords[2 * _idx3 + 1] = _uvs.uv2.y;
    }
  }

  if (geom.attributes.uv) delete geom.attributes.uv;
  geom.setAttribute("uv", new THREE__namespace.Float32BufferAttribute(coords, 2));
}

var geometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  RoundedPlaneGeometry: RoundedPlaneGeometry,
  applyCylindricalUV: applyCylindricalUV,
  applySphereUV: applySphereUV,
  applyBoxUV: applyBoxUV
});

exports.RoundedPlaneGeometry = RoundedPlaneGeometry;
exports.applyBoxUV = applyBoxUV;
exports.applyCylindricalUV = applyCylindricalUV;
exports.applySphereUV = applySphereUV;
exports.geometry = geometry;
