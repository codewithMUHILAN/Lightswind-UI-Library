import _extends from '@babel/runtime/helpers/esm/extends';
import * as THREE from 'three';
import * as React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { misc, easing } from 'maath';

const isObject3DRef = ref => (ref == null ? void 0 : ref.current) instanceof THREE.Object3D;
const MotionContext = /* @__PURE__ */React.createContext(null);
function useMotion() {
  const context = React.useContext(MotionContext);
  if (!context) throw new Error('useMotion hook must be used in a MotionPathControls component.');
  return context;
}
function Debug({
  points = 50,
  color = 'black'
}) {
  const {
    path
  } = useMotion();
  const [dots, setDots] = React.useState([]);
  const material = React.useMemo(() => new THREE.MeshBasicMaterial({
    color: color
  }), [color]);
  const geometry = React.useMemo(() => new THREE.SphereGeometry(0.025, 16, 16), []);
  const last = React.useRef([]);
  React.useEffect(() => {
    if (path.curves !== last.current) {
      setDots(path.getPoints(points));
      last.current = path.curves;
    }
  });
  return dots.map((item, index) => /*#__PURE__*/React.createElement("mesh", {
    key: index,
    material: material,
    geometry: geometry,
    position: [item.x, item.y, item.z]
  }));
}
const MotionPathControls = /* @__PURE__ */React.forwardRef(({
  children,
  curves = [],
  debug = false,
  debugColor = 'black',
  object,
  focus,
  loop = true,
  offset = undefined,
  smooth = false,
  eps = 0.00001,
  damping = 0.1,
  focusDamping = 0.1,
  maxSpeed = Infinity,
  ...props
}, fref) => {
  const {
    camera
  } = useThree();
  const ref = React.useRef(null);
  const pos = React.useRef(offset !== null && offset !== void 0 ? offset : 0);
  const path = React.useMemo(() => new THREE.CurvePath(), []);
  const state = React.useMemo(() => ({
    focus,
    object: (object == null ? void 0 : object.current) instanceof THREE.Object3D ? object : {
      current: camera
    },
    path,
    current: pos.current,
    offset: pos.current,
    point: new THREE.Vector3(),
    tangent: new THREE.Vector3(),
    next: new THREE.Vector3()
  }), [focus, object]);
  React.useLayoutEffect(() => {
    var _r3f$objects, _ref$current;
    path.curves = [];
    const _curves = curves.length > 0 ? curves : (_r3f$objects = (_ref$current = ref.current) == null || (_ref$current = _ref$current.__r3f) == null ? void 0 : _ref$current.objects) !== null && _r3f$objects !== void 0 ? _r3f$objects : [];
    for (let i = 0; i < _curves.length; i++) path.add(_curves[i]);

    // Smoothen curve
    if (smooth) {
      const points = path.getPoints(typeof smooth === 'number' ? smooth : 1);
      const catmull = new THREE.CatmullRomCurve3(points);
      path.curves = [catmull];
    }
    path.updateArcLengths();
  });
  React.useImperativeHandle(fref, () => Object.assign(ref.current, {
    motion: state
  }), [state]);
  React.useLayoutEffect(() => {
    // When offset changes, normalise pos to avoid overshoot spinning
    pos.current = misc.repeat(pos.current, 1);
  }, [offset]);
  const vec = React.useMemo(() => new THREE.Vector3(), []);
  useFrame((_state, delta) => {
    const lastOffset = state.offset;
    easing.damp(pos, 'current', offset !== undefined ? offset : state.current, damping, delta, maxSpeed, undefined, eps);
    state.offset = loop ? misc.repeat(pos.current, 1) : misc.clamp(pos.current, 0, 1);
    if (path.getCurveLengths().length > 0) {
      path.getPointAt(state.offset, state.point);
      path.getTangentAt(state.offset, state.tangent).normalize();
      path.getPointAt(misc.repeat(pos.current - (lastOffset - state.offset), 1), state.next);
      const target = (object == null ? void 0 : object.current) instanceof THREE.Object3D ? object.current : camera;
      target.position.copy(state.point);
      if (focus) {
        easing.dampLookAt(target, isObject3DRef(focus) ? focus.current.getWorldPosition(vec) : focus, focusDamping, delta, maxSpeed, undefined, eps);
      }
    }
  });
  return /*#__PURE__*/React.createElement("group", _extends({
    ref: ref
  }, props), /*#__PURE__*/React.createElement(MotionContext.Provider, {
    value: state
  }, children, debug && /*#__PURE__*/React.createElement(Debug, {
    color: debugColor
  })));
});

export { MotionPathControls, useMotion };
