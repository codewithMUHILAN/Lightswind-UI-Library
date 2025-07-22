'use strict';

var React = require('react');
var zustand = require('zustand');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var _window$document, _window$navigator;
/**
 * An SSR-friendly useLayoutEffect.
 *
 * React currently throws a warning when using useLayoutEffect on the server.
 * To get around it, we can conditionally useEffect on the server (no-op) and
 * useLayoutEffect elsewhere.
 *
 * @see https://github.com/facebook/react/issues/14927
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' && ((_window$document = window.document) != null && _window$document.createElement || ((_window$navigator = window.navigator) == null ? void 0 : _window$navigator.product) === 'ReactNative') ? React__default["default"].useLayoutEffect : React__default["default"].useEffect;

function tunnel() {
  const useStore = zustand.create(set => ({
    current: new Array(),
    version: 0,
    set
  }));
  return {
    In: ({
      children
    }) => {
      const set = useStore(state => state.set);
      const version = useStore(state => state.version);
      /* When this component mounts, we increase the store's version number.
      This will cause all existing rats to re-render (just like if the Out component
      were mapping items to a list.) The re-rendering will cause the final 
      order of rendered components to match what the user is expecting. */

      useIsomorphicLayoutEffect(() => {
        set(state => ({
          version: state.version + 1
        }));
      }, []);
      /* Any time the children _or_ the store's version number change, insert
      the specified React children into the list of rats. */

      useIsomorphicLayoutEffect(() => {
        set(({
          current
        }) => ({
          current: [...current, children]
        }));
        return () => set(({
          current
        }) => ({
          current: current.filter(c => c !== children)
        }));
      }, [children, version]);
      return null;
    },
    Out: () => {
      const current = useStore(state => state.current);
      return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, current);
    }
  };
}

module.exports = tunnel;
