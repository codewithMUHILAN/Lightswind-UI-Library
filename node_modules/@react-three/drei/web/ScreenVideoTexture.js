import _extends from '@babel/runtime/helpers/esm/extends';
import * as React from 'react';
import { forwardRef, useEffect } from 'react';
import { suspend, clear } from 'suspend-react';
import { VideoTexture } from '../core/VideoTexture.js';

/**
 * Create a video texture from [`getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
 */
const ScreenVideoTexture = /* @__PURE__ */forwardRef(({
  options = {
    video: true
  },
  ...props
}, fref) => {
  const mediaStream = suspend(() => navigator.mediaDevices.getDisplayMedia(options), []);
  useEffect(() => {
    return () => {
      mediaStream == null || mediaStream.getTracks().forEach(track => track.stop());
      clear([]);
    };
  }, [mediaStream]);
  return /*#__PURE__*/React.createElement(VideoTexture, _extends({
    ref: fref
  }, props, {
    src: mediaStream
  }));
});

export { ScreenVideoTexture };
