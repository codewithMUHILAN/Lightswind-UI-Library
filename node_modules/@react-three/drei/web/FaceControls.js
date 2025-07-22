import _extends from '@babel/runtime/helpers/esm/extends';
import * as THREE from 'three';
import * as React from 'react';
import { forwardRef, useRef, useState, useCallback, useMemo, useImperativeHandle, useEffect, Suspense, useContext, createContext } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { VideoTexture } from '../core/VideoTexture.js';
import { WebcamVideoTexture } from './WebcamVideoTexture.js';
import { Facemesh } from './Facemesh.js';
import { useFaceLandmarker } from './FaceLandmarker.js';

function mean(v1, v2) {
  return v1.clone().add(v2).multiplyScalar(0.5);
}
function localToLocal(objSrc, v, objDst) {
  // see: https://discourse.threejs.org/t/object3d-localtolocal/51564
  const v_world = objSrc.localToWorld(v);
  return objDst.worldToLocal(v_world);
}

//
//
//

const FaceControlsContext = /* @__PURE__ */createContext({});

/**
 * The camera follows your face.
 *
 * Pre-requisite: wrap into a `FaceLandmarker` provider:
 *
 * ```jsx
 * <FaceLandmarker>...</FaceLandmarker>
 * ```
 */

const FaceControls = /* @__PURE__ */forwardRef(({
  camera,
  videoTexture = {
    start: true
  },
  manualDetect = false,
  faceLandmarkerResult,
  manualUpdate = false,
  makeDefault,
  smoothTime = 0.25,
  offset = true,
  offsetScalar = 80,
  eyes = false,
  eyesAsOrigin = true,
  depth = 0.15,
  debug = false,
  facemesh
}, fref) => {
  var _result$facialTransfo, _result$faceBlendshap;
  const scene = useThree(state => state.scene);
  const defaultCamera = useThree(state => state.camera);
  const set = useThree(state => state.set);
  const get = useThree(state => state.get);
  const explCamera = camera || defaultCamera;
  const facemeshApiRef = useRef(null);

  //
  // computeTarget()
  //
  // Compute `target` position and rotation for the camera (according to <Facemesh>)
  //
  //  1. 👀 either following the 2 eyes
  //  2. 👤 or just the head mesh
  //

  const [target] = useState(() => new THREE.Object3D());
  const [irisRightDirPos] = useState(() => new THREE.Vector3());
  const [irisLeftDirPos] = useState(() => new THREE.Vector3());
  const [irisRightLookAt] = useState(() => new THREE.Vector3());
  const [irisLeftLookAt] = useState(() => new THREE.Vector3());
  const computeTarget = useCallback(() => {
    // same parent as the camera
    target.parent = explCamera.parent;
    const facemeshApi = facemeshApiRef.current;
    if (facemeshApi) {
      const {
        outerRef,
        eyeRightRef,
        eyeLeftRef
      } = facemeshApi;
      if (eyeRightRef.current && eyeLeftRef.current) {
        // 1. 👀

        const {
          irisDirRef: irisRightDirRef
        } = eyeRightRef.current;
        const {
          irisDirRef: irisLeftDirRef
        } = eyeLeftRef.current;
        if (irisRightDirRef.current && irisLeftDirRef.current && outerRef.current) {
          //
          // position: mean of irisRightDirPos,irisLeftDirPos
          //
          irisRightDirPos.copy(localToLocal(irisRightDirRef.current, new THREE.Vector3(0, 0, 0), outerRef.current));
          irisLeftDirPos.copy(localToLocal(irisLeftDirRef.current, new THREE.Vector3(0, 0, 0), outerRef.current));
          target.position.copy(localToLocal(outerRef.current, mean(irisRightDirPos, irisLeftDirPos), explCamera.parent || scene));

          //
          // lookAt: mean of irisRightLookAt,irisLeftLookAt
          //
          irisRightLookAt.copy(localToLocal(irisRightDirRef.current, new THREE.Vector3(0, 0, 1), outerRef.current));
          irisLeftLookAt.copy(localToLocal(irisLeftDirRef.current, new THREE.Vector3(0, 0, 1), outerRef.current));
          target.lookAt(outerRef.current.localToWorld(mean(irisRightLookAt, irisLeftLookAt)));
        }
      } else {
        // 2. 👤

        if (outerRef.current) {
          target.position.copy(localToLocal(outerRef.current, new THREE.Vector3(0, 0, 0), explCamera.parent || scene));
          target.lookAt(outerRef.current.localToWorld(new THREE.Vector3(0, 0, 1)));
        }
      }
    }
    return target;
  }, [explCamera, irisLeftDirPos, irisLeftLookAt, irisRightDirPos, irisRightLookAt, scene, target]);

  //
  // update()
  //
  // Updating the camera `current` position and rotation, following `target`
  //

  const [current] = useState(() => new THREE.Object3D());
  const update = useCallback(function (delta, target) {
    if (explCamera) {
      var _target;
      (_target = target) !== null && _target !== void 0 ? _target : target = computeTarget();
      if (smoothTime > 0) {
        // damping current
        const eps = 1e-9;
        easing.damp3(current.position, target.position, smoothTime, delta, undefined, undefined, eps);
        easing.dampE(current.rotation, target.rotation, smoothTime, delta, undefined, undefined, eps);
      } else {
        // instant
        current.position.copy(target.position);
        current.rotation.copy(target.rotation);
      }
      explCamera.position.copy(current.position);
      explCamera.rotation.copy(current.rotation);
    }
  }, [explCamera, computeTarget, smoothTime, current.position, current.rotation]);
  useFrame((_, delta) => {
    if (manualUpdate) return;
    update(delta);
  });

  //
  // onVideoFrame (only used if !manualDetect)
  //

  const videoTextureRef = useRef(null);
  const [_faceLandmarkerResult, setFaceLandmarkerResult] = useState();
  const faceLandmarker = useFaceLandmarker();
  const onVideoFrame = useCallback((now, metadata) => {
    const texture = videoTextureRef.current;
    if (!texture) return;
    const videoFrame = texture.source.data;
    const result = faceLandmarker == null ? void 0 : faceLandmarker.detectForVideo(videoFrame, now);
    setFaceLandmarkerResult(result);
  }, [faceLandmarker]);

  //
  // Ref API
  //

  const api = useMemo(() => Object.assign(Object.create(THREE.EventDispatcher.prototype), {
    computeTarget,
    update,
    facemeshApiRef
  }), [computeTarget, update]);
  useImperativeHandle(fref, () => api, [api]);

  //
  // makeDefault (`controls` global state)
  //

  useEffect(() => {
    if (makeDefault) {
      const old = get().controls;
      set({
        controls: api
      });
      return () => set({
        controls: old
      });
    }
  }, [makeDefault, api, get, set]);

  //
  //
  //

  const result = faceLandmarkerResult !== null && faceLandmarkerResult !== void 0 ? faceLandmarkerResult : _faceLandmarkerResult;
  const points = result == null ? void 0 : result.faceLandmarks[0];
  const facialTransformationMatrix = result == null || (_result$facialTransfo = result.facialTransformationMatrixes) == null ? void 0 : _result$facialTransfo[0];
  const faceBlendshapes = result == null || (_result$faceBlendshap = result.faceBlendshapes) == null ? void 0 : _result$faceBlendshap[0];
  const videoTextureProps = {
    onVideoFrame,
    ...videoTexture
  };
  return /*#__PURE__*/React.createElement(FaceControlsContext.Provider, {
    value: api
  }, !manualDetect && /*#__PURE__*/React.createElement(Suspense, {
    fallback: null
  }, 'src' in videoTextureProps ? /*#__PURE__*/React.createElement(VideoTexture, _extends({
    ref: videoTextureRef
  }, videoTextureProps)) : /*#__PURE__*/React.createElement(WebcamVideoTexture, _extends({
    ref: videoTextureRef
  }, videoTextureProps))), /*#__PURE__*/React.createElement(Facemesh, _extends({
    ref: facemeshApiRef,
    children: /*#__PURE__*/React.createElement("meshNormalMaterial", {
      side: THREE.DoubleSide
    })
  }, facemesh, {
    points: points,
    depth: depth,
    facialTransformationMatrix: facialTransformationMatrix,
    faceBlendshapes: faceBlendshapes,
    eyes: eyes,
    eyesAsOrigin: eyesAsOrigin,
    offset: offset,
    offsetScalar: offsetScalar,
    debug: debug,
    "rotation-z": Math.PI,
    visible: debug
  })));
});
const useFaceControls = () => useContext(FaceControlsContext);

export { FaceControls, useFaceControls };
