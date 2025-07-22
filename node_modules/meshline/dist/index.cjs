"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const THREE = require("three");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const THREE__namespace = /* @__PURE__ */ _interopNamespace(THREE);
function memcpy(src, srcOffset, dst, dstOffset, length) {
  let i;
  src = src.subarray || src.slice ? src : src.buffer;
  dst = dst.subarray || dst.slice ? dst : dst.buffer;
  src = srcOffset ? src.subarray ? src.subarray(srcOffset, length && srcOffset + length) : src.slice(srcOffset, length && srcOffset + length) : src;
  if (dst.set) {
    dst.set(src, dstOffset);
  } else {
    for (i = 0; i < src.length; i++)
      dst[i + dstOffset] = src[i];
  }
  return dst;
}
function convertPoints(points) {
  if (points instanceof Float32Array)
    return points;
  if (points instanceof THREE__namespace.BufferGeometry)
    return points.getAttribute("position").array;
  return points.map((p) => {
    const isArray = Array.isArray(p);
    return p instanceof THREE__namespace.Vector3 ? [p.x, p.y, p.z] : p instanceof THREE__namespace.Vector2 ? [p.x, p.y, 0] : isArray && p.length === 3 ? [p[0], p[1], p[2]] : isArray && p.length === 2 ? [p[0], p[1], 0] : p;
  }).flat();
}
class MeshLineGeometry extends THREE__namespace.BufferGeometry {
  constructor() {
    super();
    __publicField(this, "type", "MeshLine");
    __publicField(this, "isMeshLine", true);
    __publicField(this, "positions", []);
    __publicField(this, "previous", []);
    __publicField(this, "next", []);
    __publicField(this, "side", []);
    __publicField(this, "width", []);
    __publicField(this, "indices_array", []);
    __publicField(this, "uvs", []);
    __publicField(this, "counters", []);
    __publicField(this, "widthCallback", null);
    __publicField(this, "_attributes");
    __publicField(this, "_points", []);
    __publicField(this, "points");
    __publicField(this, "matrixWorld", new THREE__namespace.Matrix4());
    Object.defineProperties(this, {
      points: {
        enumerable: true,
        get() {
          return this._points;
        },
        set(value) {
          this.setPoints(value, this.widthCallback);
        }
      }
    });
  }
  setMatrixWorld(matrixWorld) {
    this.matrixWorld = matrixWorld;
  }
  setPoints(points, wcb) {
    points = convertPoints(points);
    this._points = points;
    this.widthCallback = wcb != null ? wcb : null;
    this.positions = [];
    this.counters = [];
    if (points.length && points[0] instanceof THREE__namespace.Vector3) {
      for (let j = 0; j < points.length; j++) {
        const p = points[j];
        const c = j / (points.length - 1);
        this.positions.push(p.x, p.y, p.z);
        this.positions.push(p.x, p.y, p.z);
        this.counters.push(c);
        this.counters.push(c);
      }
    } else {
      for (let j = 0; j < points.length; j += 3) {
        const c = j / (points.length - 1);
        this.positions.push(points[j], points[j + 1], points[j + 2]);
        this.positions.push(points[j], points[j + 1], points[j + 2]);
        this.counters.push(c);
        this.counters.push(c);
      }
    }
    this.process();
  }
  compareV3(a, b) {
    const aa = a * 6;
    const ab = b * 6;
    return this.positions[aa] === this.positions[ab] && this.positions[aa + 1] === this.positions[ab + 1] && this.positions[aa + 2] === this.positions[ab + 2];
  }
  copyV3(a) {
    const aa = a * 6;
    return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
  }
  process() {
    const l = this.positions.length / 6;
    this.previous = [];
    this.next = [];
    this.side = [];
    this.width = [];
    this.indices_array = [];
    this.uvs = [];
    let w;
    let v;
    if (this.compareV3(0, l - 1)) {
      v = this.copyV3(l - 2);
    } else {
      v = this.copyV3(0);
    }
    this.previous.push(v[0], v[1], v[2]);
    this.previous.push(v[0], v[1], v[2]);
    for (let j = 0; j < l; j++) {
      this.side.push(1);
      this.side.push(-1);
      if (this.widthCallback)
        w = this.widthCallback(j / (l - 1));
      else
        w = 1;
      this.width.push(w);
      this.width.push(w);
      this.uvs.push(j / (l - 1), 0);
      this.uvs.push(j / (l - 1), 1);
      if (j < l - 1) {
        v = this.copyV3(j);
        this.previous.push(v[0], v[1], v[2]);
        this.previous.push(v[0], v[1], v[2]);
        const n = j * 2;
        this.indices_array.push(n, n + 1, n + 2);
        this.indices_array.push(n + 2, n + 1, n + 3);
      }
      if (j > 0) {
        v = this.copyV3(j);
        this.next.push(v[0], v[1], v[2]);
        this.next.push(v[0], v[1], v[2]);
      }
    }
    if (this.compareV3(l - 1, 0)) {
      v = this.copyV3(1);
    } else {
      v = this.copyV3(l - 1);
    }
    this.next.push(v[0], v[1], v[2]);
    this.next.push(v[0], v[1], v[2]);
    if (!this._attributes || this._attributes.position.count !== this.counters.length) {
      this._attributes = {
        position: new THREE__namespace.BufferAttribute(new Float32Array(this.positions), 3),
        previous: new THREE__namespace.BufferAttribute(new Float32Array(this.previous), 3),
        next: new THREE__namespace.BufferAttribute(new Float32Array(this.next), 3),
        side: new THREE__namespace.BufferAttribute(new Float32Array(this.side), 1),
        width: new THREE__namespace.BufferAttribute(new Float32Array(this.width), 1),
        uv: new THREE__namespace.BufferAttribute(new Float32Array(this.uvs), 2),
        index: new THREE__namespace.BufferAttribute(new Uint16Array(this.indices_array), 1),
        counters: new THREE__namespace.BufferAttribute(new Float32Array(this.counters), 1)
      };
    } else {
      this._attributes.position.copyArray(new Float32Array(this.positions));
      this._attributes.position.needsUpdate = true;
      this._attributes.previous.copyArray(new Float32Array(this.previous));
      this._attributes.previous.needsUpdate = true;
      this._attributes.next.copyArray(new Float32Array(this.next));
      this._attributes.next.needsUpdate = true;
      this._attributes.side.copyArray(new Float32Array(this.side));
      this._attributes.side.needsUpdate = true;
      this._attributes.width.copyArray(new Float32Array(this.width));
      this._attributes.width.needsUpdate = true;
      this._attributes.uv.copyArray(new Float32Array(this.uvs));
      this._attributes.uv.needsUpdate = true;
      this._attributes.index.copyArray(new Uint16Array(this.indices_array));
      this._attributes.index.needsUpdate = true;
    }
    this.setAttribute("position", this._attributes.position);
    this.setAttribute("previous", this._attributes.previous);
    this.setAttribute("next", this._attributes.next);
    this.setAttribute("side", this._attributes.side);
    this.setAttribute("width", this._attributes.width);
    this.setAttribute("uv", this._attributes.uv);
    this.setAttribute("counters", this._attributes.counters);
    this.setAttribute("position", this._attributes.position);
    this.setAttribute("previous", this._attributes.previous);
    this.setAttribute("next", this._attributes.next);
    this.setAttribute("side", this._attributes.side);
    this.setAttribute("width", this._attributes.width);
    this.setAttribute("uv", this._attributes.uv);
    this.setAttribute("counters", this._attributes.counters);
    this.setIndex(this._attributes.index);
    this.computeBoundingSphere();
    this.computeBoundingBox();
  }
  advance({ x, y, z }) {
    const positions = this._attributes.position.array;
    const previous = this._attributes.previous.array;
    const next = this._attributes.next.array;
    const l = positions.length;
    memcpy(positions, 0, previous, 0, l);
    memcpy(positions, 6, positions, 0, l - 6);
    positions[l - 6] = x;
    positions[l - 5] = y;
    positions[l - 4] = z;
    positions[l - 3] = x;
    positions[l - 2] = y;
    positions[l - 1] = z;
    memcpy(positions, 6, next, 0, l - 6);
    next[l - 6] = x;
    next[l - 5] = y;
    next[l - 4] = z;
    next[l - 3] = x;
    next[l - 2] = y;
    next[l - 1] = z;
    this._attributes.position.needsUpdate = true;
    this._attributes.previous.needsUpdate = true;
    this._attributes.next.needsUpdate = true;
  }
}
const vertexShader = `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  #include <fog_pars_vertex>
  #include <clipping_planes_pars_vertex>

  attribute vec3 previous;
  attribute vec3 next;
  attribute float side;
  attribute float width;
  attribute float counters;
  
  uniform vec2 resolution;
  uniform float lineWidth;
  uniform vec3 color;
  uniform float opacity;
  uniform float sizeAttenuation;
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
  }
  
  void main() {
    float aspect = resolution.x / resolution.y;
    vColor = vec4(color, opacity);
    vUV = uv;
    vCounters = counters;
  
    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4(position, 1.0) * aspect;
    vec4 prevPos = m * vec4(previous, 1.0);
    vec4 nextPos = m * vec4(next, 1.0);
  
    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);
  
    float w = lineWidth * width;
  
    vec2 dir;
    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
      vec2 dir1 = normalize(currentP - prevP);
      vec2 dir2 = normalize(nextP - currentP);
      dir = normalize(dir1 + dir2);
  
      vec2 perp = vec2(-dir1.y, dir1.x);
      vec2 miter = vec2(-dir.y, dir.x);
      //w = clamp(w / dot(miter, perp), 0., 4. * lineWidth * width);
    }
  
    //vec2 normal = (cross(vec3(dir, 0.), vec3(0., 0., 1.))).xy;
    vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
    normal.xy *= .5 * w;
    //normal *= projectionMatrix;
    if (sizeAttenuation == 0.) {
      normal.xy *= finalPosition.w;
      normal.xy /= (vec4(resolution, 0., 1.) * projectionMatrix).xy * aspect;
    }
  
    finalPosition.xy += normal.xy * side;
    gl_Position = finalPosition;
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    #include <clipping_planes_vertex>
    #include <fog_vertex>
  }
`;
const version = /* @__PURE__ */ (() => parseInt(THREE__namespace.REVISION.replace(/\D+/g, "")))();
const colorspace_fragment = version >= 154 ? "colorspace_fragment" : "encodings_fragment";
const fragmentShader = `
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  
  uniform sampler2D map;
  uniform sampler2D alphaMap;
  uniform float useGradient;
  uniform float useMap;
  uniform float useAlphaMap;
  uniform float useDash;
  uniform float dashArray;
  uniform float dashOffset;
  uniform float dashRatio;
  uniform float visibility;
  uniform float alphaTest;
  uniform vec2 repeat;
  uniform vec3 gradient[2];
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  void main() {
    #include <logdepthbuf_fragment>
    vec4 diffuseColor = vColor;
    if (useGradient == 1.) diffuseColor = vec4(mix(gradient[0], gradient[1], vCounters), 1.0);
    if (useMap == 1.) diffuseColor *= texture2D(map, vUV * repeat);
    if (useAlphaMap == 1.) diffuseColor.a *= texture2D(alphaMap, vUV * repeat).a;
    if (diffuseColor.a < alphaTest) discard;
    if (useDash == 1.) diffuseColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
    diffuseColor.a *= step(vCounters, visibility);
    #include <clipping_planes_fragment>
    gl_FragColor = diffuseColor;     
    #include <fog_fragment>
    #include <tonemapping_fragment>
    #include <${colorspace_fragment}>
  }
`;
class MeshLineMaterial extends THREE__namespace.ShaderMaterial {
  constructor(parameters) {
    super({
      uniforms: {
        ...THREE__namespace.UniformsLib.fog,
        lineWidth: { value: 1 },
        map: { value: null },
        useMap: { value: 0 },
        alphaMap: { value: null },
        useAlphaMap: { value: 0 },
        color: { value: new THREE__namespace.Color(16777215) },
        gradient: { value: [new THREE__namespace.Color(16711680), new THREE__namespace.Color(65280)] },
        opacity: { value: 1 },
        resolution: { value: new THREE__namespace.Vector2(1, 1) },
        sizeAttenuation: { value: 1 },
        dashArray: { value: 0 },
        dashOffset: { value: 0 },
        dashRatio: { value: 0.5 },
        useDash: { value: 0 },
        useGradient: { value: 0 },
        visibility: { value: 1 },
        alphaTest: { value: 0 },
        repeat: { value: new THREE__namespace.Vector2(1, 1) }
      },
      vertexShader,
      fragmentShader
    });
    __publicField(this, "lineWidth");
    __publicField(this, "map");
    __publicField(this, "useMap");
    __publicField(this, "alphaMap");
    __publicField(this, "useAlphaMap");
    __publicField(this, "color");
    __publicField(this, "gradient");
    __publicField(this, "resolution");
    __publicField(this, "sizeAttenuation");
    __publicField(this, "dashArray");
    __publicField(this, "dashOffset");
    __publicField(this, "dashRatio");
    __publicField(this, "useDash");
    __publicField(this, "useGradient");
    __publicField(this, "visibility");
    __publicField(this, "repeat");
    this.type = "MeshLineMaterial";
    Object.defineProperties(this, {
      lineWidth: {
        enumerable: true,
        get() {
          return this.uniforms.lineWidth.value;
        },
        set(value) {
          this.uniforms.lineWidth.value = value;
        }
      },
      map: {
        enumerable: true,
        get() {
          return this.uniforms.map.value;
        },
        set(value) {
          this.uniforms.map.value = value;
        }
      },
      useMap: {
        enumerable: true,
        get() {
          return this.uniforms.useMap.value;
        },
        set(value) {
          this.uniforms.useMap.value = value;
        }
      },
      alphaMap: {
        enumerable: true,
        get() {
          return this.uniforms.alphaMap.value;
        },
        set(value) {
          this.uniforms.alphaMap.value = value;
        }
      },
      useAlphaMap: {
        enumerable: true,
        get() {
          return this.uniforms.useAlphaMap.value;
        },
        set(value) {
          this.uniforms.useAlphaMap.value = value;
        }
      },
      color: {
        enumerable: true,
        get() {
          return this.uniforms.color.value;
        },
        set(value) {
          this.uniforms.color.value = value;
        }
      },
      gradient: {
        enumerable: true,
        get() {
          return this.uniforms.gradient.value;
        },
        set(value) {
          this.uniforms.gradient.value = value;
        }
      },
      opacity: {
        enumerable: true,
        get() {
          return this.uniforms.opacity.value;
        },
        set(value) {
          this.uniforms.opacity.value = value;
        }
      },
      resolution: {
        enumerable: true,
        get() {
          return this.uniforms.resolution.value;
        },
        set(value) {
          this.uniforms.resolution.value.copy(value);
        }
      },
      sizeAttenuation: {
        enumerable: true,
        get() {
          return this.uniforms.sizeAttenuation.value;
        },
        set(value) {
          this.uniforms.sizeAttenuation.value = value;
        }
      },
      dashArray: {
        enumerable: true,
        get() {
          return this.uniforms.dashArray.value;
        },
        set(value) {
          this.uniforms.dashArray.value = value;
          this.useDash = value !== 0 ? 1 : 0;
        }
      },
      dashOffset: {
        enumerable: true,
        get() {
          return this.uniforms.dashOffset.value;
        },
        set(value) {
          this.uniforms.dashOffset.value = value;
        }
      },
      dashRatio: {
        enumerable: true,
        get() {
          return this.uniforms.dashRatio.value;
        },
        set(value) {
          this.uniforms.dashRatio.value = value;
        }
      },
      useDash: {
        enumerable: true,
        get() {
          return this.uniforms.useDash.value;
        },
        set(value) {
          this.uniforms.useDash.value = value;
        }
      },
      useGradient: {
        enumerable: true,
        get() {
          return this.uniforms.useGradient.value;
        },
        set(value) {
          this.uniforms.useGradient.value = value;
        }
      },
      visibility: {
        enumerable: true,
        get() {
          return this.uniforms.visibility.value;
        },
        set(value) {
          this.uniforms.visibility.value = value;
        }
      },
      alphaTest: {
        enumerable: true,
        get() {
          return this.uniforms.alphaTest.value;
        },
        set(value) {
          this.uniforms.alphaTest.value = value;
        }
      },
      repeat: {
        enumerable: true,
        get() {
          return this.uniforms.repeat.value;
        },
        set(value) {
          this.uniforms.repeat.value.copy(value);
        }
      }
    });
    this.setValues(parameters);
  }
  copy(source) {
    super.copy(source);
    this.lineWidth = source.lineWidth;
    this.map = source.map;
    this.useMap = source.useMap;
    this.alphaMap = source.alphaMap;
    this.useAlphaMap = source.useAlphaMap;
    this.color.copy(source.color);
    this.gradient = source.gradient;
    this.opacity = source.opacity;
    this.resolution.copy(source.resolution);
    this.sizeAttenuation = source.sizeAttenuation;
    this.dashArray = source.dashArray;
    this.dashOffset = source.dashOffset;
    this.dashRatio = source.dashRatio;
    this.useDash = source.useDash;
    this.useGradient = source.useGradient;
    this.visibility = source.visibility;
    this.alphaTest = source.alphaTest;
    this.repeat.copy(source.repeat);
    return this;
  }
}
function raycast(raycaster, intersects) {
  const inverseMatrix = new THREE__namespace.Matrix4();
  const ray = new THREE__namespace.Ray();
  const sphere = new THREE__namespace.Sphere();
  const interRay = new THREE__namespace.Vector3();
  const geometry = this.geometry;
  sphere.copy(geometry.boundingSphere);
  sphere.applyMatrix4(this.matrixWorld);
  if (!raycaster.ray.intersectSphere(sphere, interRay))
    return;
  inverseMatrix.copy(this.matrixWorld).invert();
  ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
  const vStart = new THREE__namespace.Vector3();
  const vEnd = new THREE__namespace.Vector3();
  const interSegment = new THREE__namespace.Vector3();
  const step = this instanceof THREE__namespace.LineSegments ? 2 : 1;
  const index = geometry.index;
  const attributes = geometry.attributes;
  if (index !== null) {
    const indices = index.array;
    const positions = attributes.position.array;
    const widths = attributes.width.array;
    for (let i = 0, l = indices.length - 1; i < l; i += step) {
      const a = indices[i];
      const b = indices[i + 1];
      vStart.fromArray(positions, a * 3);
      vEnd.fromArray(positions, b * 3);
      const width = widths[Math.floor(i / 3)] != void 0 ? widths[Math.floor(i / 3)] : 1;
      const precision = raycaster.params.Line.threshold + this.material.lineWidth * width / 2;
      const precisionSq = precision * precision;
      const distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
      if (distSq > precisionSq)
        continue;
      interRay.applyMatrix4(this.matrixWorld);
      const distance = raycaster.ray.origin.distanceTo(interRay);
      if (distance < raycaster.near || distance > raycaster.far)
        continue;
      intersects.push({
        distance,
        point: interSegment.clone().applyMatrix4(this.matrixWorld),
        index: i,
        face: null,
        faceIndex: void 0,
        object: this
      });
      i = l;
    }
  }
}
exports.MeshLineGeometry = MeshLineGeometry;
exports.MeshLineMaterial = MeshLineMaterial;
exports.raycast = raycast;
