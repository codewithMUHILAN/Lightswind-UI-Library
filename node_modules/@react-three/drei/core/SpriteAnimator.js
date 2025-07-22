import _extends from '@babel/runtime/helpers/esm/extends';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Instances, Instance } from './Instances.js';
import { Billboard } from './Billboard.js';
import { useSpriteLoader, getFirstFrame } from './useSpriteLoader.js';

// Frame-related types

const context = /*#__PURE__*/React.createContext(null);
function useSpriteAnimator() {
  return React.useContext(context);
}

// Type guard for SpriteData
function isSpriteData(data) {
  return data !== null && 'meta' in data && 'frames' in data;
}
const geometry = /* @__PURE__ */new THREE.PlaneGeometry(1, 1);
const SpriteAnimator = /* @__PURE__ */React.forwardRef(({
  startFrame = 0,
  endFrame,
  fps = 30,
  frameName = '',
  textureDataURL,
  textureImageURL,
  loop = false,
  numberOfFrames = 1,
  autoPlay = true,
  animationNames,
  onStart,
  onEnd,
  onLoopEnd,
  onFrame,
  play,
  pause = false,
  flipX = false,
  alphaTest = 0.0,
  children,
  asSprite = false,
  offset,
  playBackwards = false,
  resetOnEnd = false,
  maxItems = 1,
  instanceItems = [[0, 0, 0]],
  spriteDataset,
  canvasRenderingContext2DSettings,
  roundFramePosition = false,
  meshProps = {},
  ...props
}, fref) => {
  const ref = React.useRef(new THREE.Group());
  const spriteData = React.useRef(null);
  const matRef = React.useRef(null);
  const spriteRef = React.useRef(null);
  const timerOffset = React.useRef(window.performance.now());
  const currentFrame = React.useRef(startFrame);
  const currentFrameName = React.useRef(frameName);
  const fpsInterval = fps > 0 ? 1000 / fps : 0;
  const [spriteTexture, setSpriteTexture] = React.useState(new THREE.Texture());
  const totalFrames = React.useRef(0);
  const [aspect, setAspect] = React.useState(new THREE.Vector3(1, 1, 1));
  const flipOffset = flipX ? -1 : 1;
  const pauseRef = React.useRef(pause);
  const pos = React.useRef(offset);
  const softEnd = React.useRef(false);
  const {
    spriteObj,
    loadJsonAndTexture
  } = useSpriteLoader(null, null, animationNames, numberOfFrames, undefined, canvasRenderingContext2DSettings);
  const frameNameRef = React.useRef(frameName);

  // lite version for pre-loaded assets
  const parseSpriteDataLite = React.useCallback((textureData, data) => {
    if (data === null) {
      if (numberOfFrames) {
        //get size from texture

        totalFrames.current = numberOfFrames;
        if (playBackwards) {
          currentFrame.current = numberOfFrames - 1;
        }
        spriteData.current = data;
      }
    } else {
      var _spriteData$current$f, _spriteData$current;
      spriteData.current = data;
      if (spriteData.current && Array.isArray(spriteData.current.frames)) {
        totalFrames.current = spriteData.current.frames.length;
      } else if (spriteData.current && typeof spriteData.current === 'object' && frameNameRef.current) {
        totalFrames.current = spriteData.current.frames[frameNameRef.current].length;
      } else {
        totalFrames.current = 0;
      }
      if (playBackwards) {
        currentFrame.current = totalFrames.current - 1;
      }
      const {
        w,
        h
      } = getFirstFrame((_spriteData$current$f = (_spriteData$current = spriteData.current) == null ? void 0 : _spriteData$current.frames) !== null && _spriteData$current$f !== void 0 ? _spriteData$current$f : [], frameNameRef.current).sourceSize;
      const aspect = calculateAspectRatio(w, h);
      setAspect(aspect);
      if (matRef.current) {
        matRef.current.map = textureData;
      }
    }
    setSpriteTexture(textureData);
  }, [numberOfFrames, playBackwards]);

  // modify the sprite material after json is parsed and state updated
  const modifySpritePosition = React.useCallback(() => {
    if (!spriteData.current) return;
    const {
      meta: {
        size: metaInfo
      },
      frames
    } = spriteData.current;
    const {
      w: frameW,
      h: frameH
    } = Array.isArray(frames) ? frames[0].sourceSize : frameName ? frames[frameName] ? frames[frameName][0].sourceSize : {
      w: 0,
      h: 0
    } : {
      w: 0,
      h: 0
    };
    if (matRef.current && matRef.current.map) {
      matRef.current.map.wrapS = matRef.current.map.wrapT = THREE.RepeatWrapping;
      matRef.current.map.center.set(0, 0);
      matRef.current.map.repeat.set(1 * flipOffset / (metaInfo.w / frameW), 1 / (metaInfo.h / frameH));
    }
    //const framesH = (metaInfo.w - 1) / frameW
    const framesV = (metaInfo.h - 1) / frameH;
    const frameOffsetY = 1 / framesV;
    if (matRef.current && matRef.current.map) {
      matRef.current.map.offset.x = 0.0; //-matRef.current.map.repeat.x
      matRef.current.map.offset.y = 1 - frameOffsetY;
    }
    if (onStart) {
      onStart({
        currentFrameName: frameName !== null && frameName !== void 0 ? frameName : '',
        currentFrame: currentFrame.current
      });
    }
  }, [flipOffset, frameName, onStart]);
  const state = React.useMemo(() => ({
    current: pos.current,
    offset: pos.current,
    imageUrl: textureImageURL,
    hasEnded: false,
    ref: fref
  }), [textureImageURL, fref]);
  React.useImperativeHandle(fref, () => ref.current, []);
  React.useLayoutEffect(() => {
    pos.current = offset;
  }, [offset]);
  const calculateAspectRatio = (width, height) => {
    var _spriteRef$current;
    const ret = new THREE.Vector3();
    const aspectRatio = height / width;
    ret.set(1, aspectRatio, 1);
    (_spriteRef$current = spriteRef.current) == null || _spriteRef$current.scale.copy(ret);
    return ret;
  };

  // initial loads
  React.useEffect(() => {
    if (spriteDataset) {
      var _spriteDataset$sprite;
      parseSpriteDataLite(spriteDataset == null || (_spriteDataset$sprite = spriteDataset.spriteTexture) == null ? void 0 : _spriteDataset$sprite.clone(), spriteDataset.spriteData);
    } else {
      if (textureImageURL && textureDataURL) {
        loadJsonAndTexture(textureImageURL, textureDataURL);
      }
    }
  }, [loadJsonAndTexture, spriteDataset, textureDataURL, textureImageURL, parseSpriteDataLite]);
  React.useEffect(() => {
    if (spriteObj) {
      var _spriteObj$spriteText;
      parseSpriteDataLite(spriteObj == null || (_spriteObj$spriteText = spriteObj.spriteTexture) == null ? void 0 : _spriteObj$spriteText.clone(), spriteObj == null ? void 0 : spriteObj.spriteData);
    }
  }, [spriteObj, parseSpriteDataLite]);

  // support backwards play
  React.useEffect(() => {
    state.hasEnded = false;
    if (spriteData.current && playBackwards === true) {
      var _ref;
      currentFrame.current = ((_ref = spriteData.current.frames.length) !== null && _ref !== void 0 ? _ref : 0) - 1;
    } else {
      currentFrame.current = 0;
    }
  }, [playBackwards, state]);
  React.useLayoutEffect(() => {
    modifySpritePosition();
  }, [spriteTexture, flipX, modifySpritePosition]);
  React.useEffect(() => {
    if (autoPlay) {
      pauseRef.current = false;
    }
  }, [autoPlay]);
  React.useLayoutEffect(() => {
    if (currentFrameName.current !== frameName && frameName) {
      currentFrame.current = 0;
      currentFrameName.current = frameName;
      state.hasEnded = false;
      if (fpsInterval <= 0) {
        currentFrame.current = endFrame || startFrame || 0;
      }
      // modifySpritePosition()
      if (spriteData.current) {
        const {
          w,
          h
        } = getFirstFrame(spriteData.current.frames, frameName).sourceSize;
        const _aspect = calculateAspectRatio(w, h);
        setAspect(_aspect);
      }
    }
  }, [frameName, fpsInterval, state, endFrame, startFrame]);

  // run the animation on each frame
  const runAnimation = () => {
    if (!isSpriteData(spriteData.current)) return;
    const {
      meta: {
        size: metaInfo
      },
      frames
    } = spriteData.current;
    const {
      w: frameW,
      h: frameH
    } = getFirstFrame(frames, frameName).sourceSize;
    const spriteFrames = Array.isArray(frames) ? frames : frameName ? frames[frameName] : [];
    const _endFrame = endFrame || spriteFrames.length - 1;
    var _offset = offset === undefined ? state.current : offset;
    if (fpsInterval <= 0) {
      currentFrame.current = endFrame || startFrame || 0;
      calculateFinalPosition(frameW, frameH, metaInfo, spriteFrames);
      return;
    }
    const now = window.performance.now();
    const diff = now - timerOffset.current;
    if (diff <= fpsInterval) return;

    // conditionals to support backwards play
    var endCondition = playBackwards ? currentFrame.current < 0 : currentFrame.current > _endFrame;
    var onStartCondition = playBackwards ? currentFrame.current === _endFrame : currentFrame.current === 0;
    var manualProgressEndCondition = playBackwards ? currentFrame.current < 0 : currentFrame.current >= _endFrame;
    if (endCondition) {
      currentFrame.current = loop ? startFrame !== null && startFrame !== void 0 ? startFrame : 0 : 0;
      if (playBackwards) {
        currentFrame.current = _endFrame;
      }
      if (loop) {
        onLoopEnd == null || onLoopEnd({
          currentFrameName: frameName !== null && frameName !== void 0 ? frameName : '',
          currentFrame: currentFrame.current
        });
      } else {
        onEnd == null || onEnd({
          currentFrameName: frameName !== null && frameName !== void 0 ? frameName : '',
          currentFrame: currentFrame.current
        });
        state.hasEnded = !resetOnEnd;
        if (resetOnEnd) {
          pauseRef.current = true;
          //calculateFinalPosition(frameW, frameH, metaInfo, spriteFrames)
        }
      }
      if (!loop) return;
    } else if (onStartCondition) {
      onStart == null || onStart({
        currentFrameName: frameName !== null && frameName !== void 0 ? frameName : '',
        currentFrame: currentFrame.current
      });
    }

    // for manual update
    if (_offset !== undefined && manualProgressEndCondition) {
      if (softEnd.current === false) {
        onEnd == null || onEnd({
          currentFrameName: frameName !== null && frameName !== void 0 ? frameName : '',
          currentFrame: currentFrame.current
        });
        softEnd.current = true;
      }
    } else {
      // same for start?
      softEnd.current = false;
    }

    // clock to limit fps
    if (diff <= fpsInterval) return;
    timerOffset.current = now - diff % fpsInterval;
    calculateFinalPosition(frameW, frameH, metaInfo, spriteFrames);
  };
  const calculateFinalPosition = (frameW, frameH, metaInfo, spriteFrames) => {
    // get the manual update offset to find the next frame
    var _offset = offset === undefined ? state.current : offset;
    const targetFrame = currentFrame.current;
    let finalValX = 0;
    let finalValY = 0;
    calculateAspectRatio(frameW, frameH);
    const framesH = roundFramePosition ? Math.round((metaInfo.w - 1) / frameW) : (metaInfo.w - 1) / frameW;
    const framesV = roundFramePosition ? Math.round((metaInfo.h - 1) / frameH) : (metaInfo.h - 1) / frameH;
    if (!spriteFrames[targetFrame]) {
      return;
    }
    const {
      frame: {
        x: frameX,
        y: frameY
      },
      sourceSize: {
        w: originalSizeX,
        h: originalSizeY
      }
    } = spriteFrames[targetFrame];
    const frameOffsetX = 1 / framesH;
    const frameOffsetY = 1 / framesV;
    if (matRef.current && matRef.current.map) {
      finalValX = flipOffset > 0 ? frameOffsetX * (frameX / originalSizeX) : frameOffsetX * (frameX / originalSizeX) - matRef.current.map.repeat.x;
      finalValY = Math.abs(1 - frameOffsetY) - frameOffsetY * (frameY / originalSizeY);
      matRef.current.map.offset.x = finalValX;
      matRef.current.map.offset.y = finalValY;
    }

    // if manual update is active
    if (_offset !== undefined && _offset !== null) {
      // Calculate the frame index, based on offset given from the provider
      let frameIndex = Math.floor(_offset * spriteFrames.length);

      // Ensure the frame index is within the valid range
      frameIndex = Math.max(0, Math.min(frameIndex, spriteFrames.length - 1));
      if (isNaN(frameIndex)) {
        frameIndex = 0; //fallback
      }
      currentFrame.current = frameIndex;
    } else {
      // auto update
      if (playBackwards) {
        currentFrame.current -= 1;
      } else {
        currentFrame.current += 1;
      }
    }
  };

  // *** Warning! It runs on every frame! ***
  useFrame((_state, _delta) => {
    var _spriteData$current2, _matRef$current;
    if (!((_spriteData$current2 = spriteData.current) != null && _spriteData$current2.frames) || !((_matRef$current = matRef.current) != null && _matRef$current.map)) {
      return;
    }
    if (pauseRef.current) {
      return;
    }
    if (!state.hasEnded && (autoPlay || play)) {
      runAnimation();
      onFrame == null || onFrame({
        currentFrameName: currentFrameName.current,
        currentFrame: currentFrame.current
      });
    }
  });
  function multiplyScale(initialScale = new THREE.Vector3(1, 1, 1), newScale = 1) {
    if (typeof newScale === 'number') return initialScale.multiplyScalar(newScale);
    if (Array.isArray(newScale)) return initialScale.multiply(new THREE.Vector3(...newScale));
    if (newScale instanceof THREE.Vector3) return initialScale.multiply(newScale);
  }
  return /*#__PURE__*/React.createElement("group", _extends({}, props, {
    ref: ref,
    scale: multiplyScale(aspect, props.scale)
  }), /*#__PURE__*/React.createElement(context.Provider, {
    value: state
  }, asSprite && /*#__PURE__*/React.createElement(Billboard, null, /*#__PURE__*/React.createElement("mesh", _extends({
    ref: spriteRef,
    scale: 1.0,
    geometry: geometry
  }, meshProps), /*#__PURE__*/React.createElement("meshBasicMaterial", {
    premultipliedAlpha: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    ref: matRef,
    map: spriteTexture,
    transparent: true,
    alphaTest: alphaTest !== null && alphaTest !== void 0 ? alphaTest : 0.0
  }))), !asSprite && /*#__PURE__*/React.createElement(Instances, _extends({
    geometry: geometry,
    limit: maxItems !== null && maxItems !== void 0 ? maxItems : 1
  }, meshProps), /*#__PURE__*/React.createElement("meshBasicMaterial", {
    premultipliedAlpha: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    ref: matRef,
    map: spriteTexture,
    transparent: true,
    alphaTest: alphaTest !== null && alphaTest !== void 0 ? alphaTest : 0.0
  }), (instanceItems !== null && instanceItems !== void 0 ? instanceItems : [0]).map((item, index) => /*#__PURE__*/React.createElement(Instance, _extends({
    key: index,
    ref: (instanceItems == null ? void 0 : instanceItems.length) === 1 ? spriteRef : null,
    position: item,
    scale: 1.0
  }, meshProps)))), children));
});

export { SpriteAnimator, useSpriteAnimator };
