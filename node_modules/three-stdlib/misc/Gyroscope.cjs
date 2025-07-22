"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const THREE = require("three");
const _translationObject = /* @__PURE__ */ new THREE.Vector3();
const _quaternionObject = /* @__PURE__ */ new THREE.Quaternion();
const _scaleObject = /* @__PURE__ */ new THREE.Vector3();
const _translationWorld = /* @__PURE__ */ new THREE.Vector3();
const _quaternionWorld = /* @__PURE__ */ new THREE.Quaternion();
const _scaleWorld = /* @__PURE__ */ new THREE.Vector3();
class Gyroscope extends THREE.Object3D {
  constructor() {
    super();
  }
  updateMatrixWorld(force) {
    this.matrixAutoUpdate && this.updateMatrix();
    if (this.matrixWorldNeedsUpdate || force) {
      if (this.parent !== null) {
        this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
        this.matrixWorld.decompose(_translationWorld, _quaternionWorld, _scaleWorld);
        this.matrix.decompose(_translationObject, _quaternionObject, _scaleObject);
        this.matrixWorld.compose(_translationWorld, _quaternionObject, _scaleWorld);
      } else {
        this.matrixWorld.copy(this.matrix);
      }
      this.matrixWorldNeedsUpdate = false;
      force = true;
    }
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].updateMatrixWorld(force);
    }
  }
}
exports.Gyroscope = Gyroscope;
//# sourceMappingURL=Gyroscope.cjs.map
