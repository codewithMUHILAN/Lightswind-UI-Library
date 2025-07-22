import _extends from '@babel/runtime/helpers/esm/extends';
import { applyProps } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';

const Lightformer = /* @__PURE__ */React.forwardRef(({
  light,
  args,
  map,
  toneMapped = false,
  color = 'white',
  form: Form = 'rect',
  intensity = 1,
  scale = 1,
  target = [0, 0, 0],
  children,
  ...props
}, forwardRef) => {
  // Apply emissive power
  const ref = React.useRef(null);
  React.useImperativeHandle(forwardRef, () => ref.current, []);
  React.useLayoutEffect(() => {
    if (!children && !props.material) {
      applyProps(ref.current.material, {
        color
      });
      ref.current.material.color.multiplyScalar(intensity);
    }
  }, [color, intensity, children, props.material]);

  // Target light
  React.useLayoutEffect(() => {
    if (!props.rotation) ref.current.quaternion.identity();
    if (target && !props.rotation) {
      'boolean' === typeof target ? ref.current.lookAt(0, 0, 0) : ref.current.lookAt(Array.isArray(target) ? new THREE.Vector3(...target) : target);
    }
  }, [target, props.rotation]);

  // Fix 2-dimensional scale
  scale = Array.isArray(scale) && scale.length === 2 ? [scale[0], scale[1], 1] : scale;
  return /*#__PURE__*/React.createElement("mesh", _extends({
    ref: ref,
    scale: scale
  }, props), Form === 'circle' ? /*#__PURE__*/React.createElement("ringGeometry", {
    args: args ? args : [0, 0.5, 64]
  }) : Form === 'ring' ? /*#__PURE__*/React.createElement("ringGeometry", {
    args: args ? args : [0.25, 0.5, 64]
  }) : Form === 'rect' || Form === 'plane' ? /*#__PURE__*/React.createElement("planeGeometry", {
    args: args ? args : [1, 1]
  }) : Form === 'box' ? /*#__PURE__*/React.createElement("boxGeometry", {
    args: args ? args : [1, 1, 1]
  }) : /*#__PURE__*/React.createElement(Form, {
    args: args
  }), children ? children : /*#__PURE__*/React.createElement("meshBasicMaterial", {
    toneMapped: toneMapped,
    map: map,
    side: THREE.DoubleSide
  }), light && /*#__PURE__*/React.createElement("pointLight", _extends({
    castShadow: true
  }, light)));
});

export { Lightformer };
