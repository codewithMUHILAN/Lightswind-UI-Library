import * as React from 'react';
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { suspend } from 'suspend-react';
import { Events } from 'hls.js';

/* eslint react-hooks/exhaustive-deps: 1 */
const IS_BROWSER = /* @__PURE__ */((_window$document, _window$navigator) => typeof window !== 'undefined' && typeof ((_window$document = window.document) == null ? void 0 : _window$document.createElement) === 'function' && typeof ((_window$navigator = window.navigator) == null ? void 0 : _window$navigator.userAgent) === 'string')();
let _HLSModule = null;
async function getHls(...args) {
  var _HLSModule2;
  (_HLSModule2 = _HLSModule) !== null && _HLSModule2 !== void 0 ? _HLSModule2 : _HLSModule = await import('hls.js'); // singleton
  const Ctor = _HLSModule.default;
  if (Ctor.isSupported()) {
    return new Ctor(...args);
  }
  return null;
}
function useVideoTexture(srcOrSrcObject, {
  unsuspend = 'loadedmetadata',
  start = true,
  hls: hlsConfig = {},
  crossOrigin = 'anonymous',
  muted = true,
  loop = true,
  playsInline = true,
  onVideoFrame,
  ...videoProps
} = {}) {
  const gl = useThree(state => state.gl);
  const hlsRef = useRef(null);
  const texture = suspend(() => new Promise(async res => {
    let src = undefined;
    let srcObject = undefined;
    if (typeof srcOrSrcObject === 'string') {
      src = srcOrSrcObject;
    } else {
      srcObject = srcOrSrcObject;
    }
    const video = Object.assign(document.createElement('video'), {
      src,
      srcObject,
      crossOrigin,
      loop,
      muted,
      playsInline,
      ...videoProps
    });

    // hlsjs extension
    if (src && IS_BROWSER && src.endsWith('.m3u8')) {
      const hls = hlsRef.current = await getHls(hlsConfig);
      if (hls) {
        hls.on(Events.MEDIA_ATTACHED, () => void hls.loadSource(src));
        hls.attachMedia(video);
      }
    }
    const texture = new THREE.VideoTexture(video);
    if ('colorSpace' in texture) texture.colorSpace = gl.outputColorSpace;else texture.encoding = gl.outputEncoding;
    video.addEventListener(unsuspend, () => res(texture));
  }), [srcOrSrcObject]);
  const video = texture.source.data;
  useVideoFrame(video, onVideoFrame);
  useEffect(() => {
    start && texture.image.play();
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [texture, start]);
  return texture;
}

//
// VideoTexture
//

const VideoTexture = /* @__PURE__ */forwardRef(({
  children,
  src,
  ...config
}, fref) => {
  const texture = useVideoTexture(src, config);
  useEffect(() => {
    return () => void texture.dispose();
  }, [texture]);
  useImperativeHandle(fref, () => texture, [texture]); // expose texture through ref

  return /*#__PURE__*/React.createElement(React.Fragment, null, children == null ? void 0 : children(texture));
});

// rVFC hook

const useVideoFrame = (video, f) => {
  useEffect(() => {
    if (!f) return;
    if (!video.requestVideoFrameCallback) return;
    let handle;
    const callback = (...args) => {
      f(...args);
      handle = video.requestVideoFrameCallback(callback);
    };
    video.requestVideoFrameCallback(callback);
    return () => video.cancelVideoFrameCallback(handle);
  }, [video, f]);
};

export { VideoTexture, useVideoTexture };
