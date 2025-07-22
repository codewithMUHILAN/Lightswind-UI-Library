var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { Object3D, Mesh, SphereGeometry, MeshBasicMaterial, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, InstancedMesh, Vector3 } from "three";
const _o = /* @__PURE__ */ new Object3D();
const _v = /* @__PURE__ */ new Vector3();
class RaycasterHelper extends Object3D {
  constructor(raycaster, numberOfHitsToVisualize = 20) {
    super();
    __publicField(this, "raycaster");
    __publicField(this, "hits");
    __publicField(this, "origin");
    __publicField(this, "near");
    __publicField(this, "far");
    __publicField(this, "nearToFar");
    __publicField(this, "originToNear");
    __publicField(this, "hitPoints");
    __publicField(this, "colors", {
      near: 16777215,
      far: 16777215,
      originToNear: 3355443,
      nearToFar: 16777215,
      origin: [978050, 16711771]
    });
    __publicField(this, "setColors", (colors) => {
      const _colors = {
        ...this.colors,
        ...colors
      };
      this.near.material.color.set(_colors.near);
      this.far.material.color.set(_colors.far);
      this.nearToFar.material.color.set(_colors.nearToFar);
      this.originToNear.material.color.set(_colors.originToNear);
    });
    __publicField(this, "update", () => {
      var _a;
      const origin = this.raycaster.ray.origin;
      const direction = this.raycaster.ray.direction;
      this.origin.position.copy(origin);
      this.near.position.copy(origin).add(direction.clone().multiplyScalar(this.raycaster.near));
      this.far.position.copy(origin).add(direction.clone().multiplyScalar(this.raycaster.far));
      this.far.lookAt(origin);
      this.near.lookAt(origin);
      let pos = this.nearToFar.geometry.getAttribute("position");
      pos.set([...this.near.position.toArray(), ...this.far.position.toArray()]);
      pos.needsUpdate = true;
      pos = this.originToNear.geometry.getAttribute("position");
      pos.set([...origin.toArray(), ...this.near.position.toArray()]);
      pos.needsUpdate = true;
      for (let i = 0; i < this.numberOfHitsToVisualize; i++) {
        const hit = (_a = this.hits) == null ? void 0 : _a[i];
        if (hit) {
          const { point } = hit;
          _o.position.copy(point);
          _o.scale.setScalar(1);
        } else {
          _o.scale.setScalar(0);
        }
        _o.updateMatrix();
        this.hitPoints.setMatrixAt(i, _o.matrix);
      }
      this.hitPoints.instanceMatrix.needsUpdate = true;
      this.origin.material.color.set(this.hits.length > 0 ? this.colors.origin[0] : this.colors.origin[1]);
    });
    __publicField(this, "dispose", () => {
      this.origin.geometry.dispose();
      this.origin.material.dispose();
      this.near.geometry.dispose();
      this.near.material.dispose();
      this.far.geometry.dispose();
      this.far.material.dispose();
      this.nearToFar.geometry.dispose();
      this.nearToFar.material.dispose();
      this.originToNear.geometry.dispose();
      this.originToNear.material.dispose();
      this.hitPoints.dispose();
    });
    this.numberOfHitsToVisualize = numberOfHitsToVisualize;
    this.raycaster = raycaster;
    this.hits = [];
    this.origin = new Mesh(new SphereGeometry(0.04, 32), new MeshBasicMaterial());
    this.origin.name = "RaycasterHelper_origin";
    this.origin.raycast = () => null;
    const size = 0.1;
    let geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute([
      -size,
      size,
      0,
      size,
      size,
      0,
      size,
      -size,
      0,
      -size,
      -size,
      0,
      -size,
      size,
      0
    ], 3));
    this.near = new Line(geometry, new LineBasicMaterial());
    this.near.name = "RaycasterHelper_near";
    this.near.raycast = () => null;
    this.far = new Line(geometry, new LineBasicMaterial());
    this.far.name = "RaycasterHelper_far";
    this.far.raycast = () => null;
    this.nearToFar = new Line(new BufferGeometry(), new LineBasicMaterial());
    this.nearToFar.name = "RaycasterHelper_nearToFar";
    this.nearToFar.raycast = () => null;
    this.nearToFar.geometry.setFromPoints([_v, _v]);
    this.originToNear = new Line(this.nearToFar.geometry.clone(), new LineBasicMaterial());
    this.originToNear.name = "RaycasterHelper_originToNear";
    this.originToNear.raycast = () => null;
    this.hitPoints = new InstancedMesh(new SphereGeometry(0.04), new MeshBasicMaterial(), this.numberOfHitsToVisualize);
    this.hitPoints.name = "RaycasterHelper_hits";
    this.hitPoints.raycast = () => null;
    this.add(this.nearToFar);
    this.add(this.originToNear);
    this.add(this.near);
    this.add(this.far);
    this.add(this.origin);
    this.add(this.hitPoints);
    this.setColors();
  }
}
export {
  RaycasterHelper
};
//# sourceMappingURL=RaycasterHelper.js.map
