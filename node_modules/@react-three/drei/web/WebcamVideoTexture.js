import _extends from '@babel/runtime/helpers/esm/extends';
import * as React from 'react';
import { forwardRef, useEffect } from 'react';
import { suspend, clear } from 'suspend-react';
import { VideoTexture } from '../core/VideoTexture.js';

/**
 * Create a video texture from [`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
 */
const WebcamVideoTexture = /* @__PURE__ */forwardRef(({
  constraints = {
    audio: false,
    video: {
      facingMode: 'user'
    }
  },
  ...props
}, fref) => {
  const mediaStream = suspend(() => navigator.mediaDevices.getUserMedia(constraints), []);
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

export { WebcamVideoTexture };
