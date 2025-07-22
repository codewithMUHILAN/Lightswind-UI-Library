'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var events = require('./events-d0566a2e.cjs.dev.js');
var React = require('react');
var THREE = require('three');
var useMeasure = require('react-use-measure');
var itsFine = require('its-fine');
var jsxRuntime = require('react/jsx-runtime');
require('react-reconciler/constants');
require('zustand');
require('suspend-react');
require('react-reconciler');
require('scheduler');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

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

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);
var useMeasure__default = /*#__PURE__*/_interopDefault(useMeasure);

const CanvasImpl = /*#__PURE__*/React__namespace.forwardRef(function Canvas({
  children,
  fallback,
  resize,
  style,
  gl,
  events: events$1 = events.createPointerEvents,
  eventSource,
  eventPrefix,
  shadows,
  linear,
  flat,
  legacy,
  orthographic,
  frameloop,
  dpr,
  performance,
  raycaster,
  camera,
  scene,
  onPointerMissed,
  onCreated,
  ...props
}, forwardedRef) {
  // Create a known catalogue of Threejs-native elements
  // This will include the entire THREE namespace by default, users can extend
  // their own elements by using the createRoot API instead
  React__namespace.useMemo(() => events.extend(THREE__namespace), []);
  const Bridge = itsFine.useContextBridge();
  const [containerRef, containerRect] = useMeasure__default["default"]({
    scroll: true,
    debounce: {
      scroll: 50,
      resize: 0
    },
    ...resize
  });
  const canvasRef = React__namespace.useRef(null);
  const divRef = React__namespace.useRef(null);
  React__namespace.useImperativeHandle(forwardedRef, () => canvasRef.current);
  const handlePointerMissed = events.useMutableCallback(onPointerMissed);
  const [block, setBlock] = React__namespace.useState(false);
  const [error, setError] = React__namespace.useState(false);

  // Suspend this component if block is a promise (2nd run)
  if (block) throw block;
  // Throw exception outwards if anything within canvas throws
  if (error) throw error;
  const root = React__namespace.useRef(null);
  events.useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (containerRect.width > 0 && containerRect.height > 0 && canvas) {
      if (!root.current) root.current = events.createRoot(canvas);
      root.current.configure({
        gl,
        events: events$1,
        shadows,
        linear,
        flat,
        legacy,
        orthographic,
        frameloop,
        dpr,
        performance,
        raycaster,
        camera,
        scene,
        size: containerRect,
        // Pass mutable reference to onPointerMissed so it's free to update
        onPointerMissed: (...args) => handlePointerMissed.current == null ? void 0 : handlePointerMissed.current(...args),
        onCreated: state => {
          // Connect to event source
          state.events.connect == null ? void 0 : state.events.connect(eventSource ? events.isRef(eventSource) ? eventSource.current : eventSource : divRef.current);
          // Set up compute function
          if (eventPrefix) {
            state.setEvents({
              compute: (event, state) => {
                const x = event[eventPrefix + 'X'];
                const y = event[eventPrefix + 'Y'];
                state.pointer.set(x / state.size.width * 2 - 1, -(y / state.size.height) * 2 + 1);
                state.raycaster.setFromCamera(state.pointer, state.camera);
              }
            });
          }
          // Call onCreated callback
          onCreated == null ? void 0 : onCreated(state);
        }
      });
      root.current.render( /*#__PURE__*/jsxRuntime.jsx(Bridge, {
        children: /*#__PURE__*/jsxRuntime.jsx(events.ErrorBoundary, {
          set: setError,
          children: /*#__PURE__*/jsxRuntime.jsx(React__namespace.Suspense, {
            fallback: /*#__PURE__*/jsxRuntime.jsx(events.Block, {
              set: setBlock
            }),
            children: children != null ? children : null
          })
        })
      }));
    }
  });
  React__namespace.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) return () => events.unmountComponentAtNode(canvas);
  }, []);

  // When the event source is not this div, we need to set pointer-events to none
  // Or else the canvas will block events from reaching the event source
  const pointerEvents = eventSource ? 'none' : 'auto';
  return /*#__PURE__*/jsxRuntime.jsx("div", {
    ref: divRef,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents,
      ...style
    },
    ...props,
    children: /*#__PURE__*/jsxRuntime.jsx("div", {
      ref: containerRef,
      style: {
        width: '100%',
        height: '100%'
      },
      children: /*#__PURE__*/jsxRuntime.jsx("canvas", {
        ref: canvasRef,
        style: {
          display: 'block'
        },
        children: fallback
      })
    })
  });
});

/**
 * A DOM canvas which accepts threejs elements as children.
 * @see https://docs.pmnd.rs/react-three-fiber/api/canvas
 */
const Canvas = /*#__PURE__*/React__namespace.forwardRef(function CanvasWrapper(props, ref) {
  return /*#__PURE__*/jsxRuntime.jsx(itsFine.FiberProvider, {
    children: /*#__PURE__*/jsxRuntime.jsx(CanvasImpl, {
      ...props,
      ref: ref
    })
  });
});

exports.ReactThreeFiber = events.threeTypes;
exports._roots = events.roots;
exports.act = events.act;
exports.addAfterEffect = events.addAfterEffect;
exports.addEffect = events.addEffect;
exports.addTail = events.addTail;
exports.advance = events.advance;
exports.applyProps = events.applyProps;
exports.buildGraph = events.buildGraph;
exports.context = events.context;
exports.createEvents = events.createEvents;
exports.createPointerEvents = events.createPointerEvents;
exports.createPortal = events.createPortal;
exports.createRoot = events.createRoot;
exports.dispose = events.dispose;
exports.events = events.createPointerEvents;
exports.extend = events.extend;
exports.flushGlobalEffects = events.flushGlobalEffects;
exports.flushSync = events.flushSync;
exports.getRootState = events.getRootState;
exports.invalidate = events.invalidate;
exports.reconciler = events.reconciler;
exports.render = events.render;
exports.unmountComponentAtNode = events.unmountComponentAtNode;
exports.useFrame = events.useFrame;
exports.useGraph = events.useGraph;
exports.useInstanceHandle = events.useInstanceHandle;
exports.useLoader = events.useLoader;
exports.useStore = events.useStore;
exports.useThree = events.useThree;
exports.Canvas = Canvas;
