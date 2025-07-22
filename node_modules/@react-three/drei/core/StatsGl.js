import { useThree, addAfterEffect } from '@react-three/fiber';
import * as React from 'react';
import Stats from 'stats-gl';

const StatsGl = /* @__PURE__ */React.forwardRef(function StatsGl({
  className,
  parent,
  id,
  clearStatsGlStyle,
  ...props
}, fref) {
  const gl = useThree(state => state.gl);
  const stats = React.useMemo(() => {
    const stats = new Stats({
      ...props
    });
    stats.init(gl);
    return stats;
  }, [gl]);
  React.useImperativeHandle(fref, () => stats.domElement, [stats]);
  React.useEffect(() => {
    if (stats) {
      const node = parent && parent.current || document.body;
      node == null || node.appendChild(stats.domElement);
      stats.domElement.querySelectorAll('canvas').forEach(canvas => {
        canvas.style.removeProperty('position');
      });
      if (id) stats.domElement.id = id;
      if (clearStatsGlStyle) stats.domElement.removeAttribute('style');
      stats.domElement.removeAttribute('style');
      const classNames = (className !== null && className !== void 0 ? className : '').split(' ').filter(cls => cls);
      if (classNames.length) stats.domElement.classList.add(...classNames);
      const end = addAfterEffect(() => stats.update());
      return () => {
        if (classNames.length) stats.domElement.classList.remove(...classNames);
        node == null || node.removeChild(stats.domElement);
        end();
      };
    }
  }, [parent, stats, className, id, clearStatsGlStyle]);
  return null;
});

export { StatsGl };
