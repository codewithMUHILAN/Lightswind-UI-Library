import { FC, Suspense, useRef, useLayoutEffect, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useFBX,
  useProgress,
  Html,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

// ---
// Types and Constants
// ---

export interface ViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableManualRotation?: boolean;
  enableManualZoom?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?:
    | "city"
    | "sunset"
    | "night"
    | "dawn"
    | "studio"
    | "apartment"
    | "forest"
    | "park"
    | "none";
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onModelLoaded?: () => void;
}

const isTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const deg2rad = (d: number) => (d * Math.PI) / 180;

// ---
// Reusable Components
// ---

const Loader: FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-gray-400 text-lg">{`${Math.round(progress)} %`}</div>
    </Html>
  );
};

// Component for handling GLTF/GLB models
const GltfContent: FC<{ url: string; onLoaded: () => void }> = ({
  url,
  onLoaded,
}) => {
  const { scene } = useGLTF(url);
  useLayoutEffect(() => {
    if (scene) {
      scene.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      onLoaded();
    }
  }, [scene, onLoaded]);
  return <primitive object={scene.clone()} />;
};

// Component for handling FBX models
const FbxContent: FC<{ url: string; onLoaded: () => void }> = ({
  url,
  onLoaded,
}) => {
  const fbx = useFBX(url);
  useLayoutEffect(() => {
    if (fbx) {
      fbx.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      onLoaded();
    }
  }, [fbx, onLoaded]);
  return <primitive object={fbx.clone()} />;
};

// Component for handling OBJ models
const ObjContent: FC<{ url: string; onLoaded: () => void }> = ({
  url,
  onLoaded,
}) => {
  const obj = useLoader(OBJLoader as unknown as any, url);
  useLayoutEffect(() => {
    if (obj) {
      obj.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      onLoaded();
    }
  }, [obj, onLoaded]);
  return <primitive object={obj.clone()} />;
};

const SceneContent: FC<{
  url: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onLoaded?: () => void;
}> = ({ url, autoRotate, autoRotateSpeed, onLoaded }) => {
  const modelRef = useRef<THREE.Group>(null!);
  const ext = url.split(".").pop()?.toLowerCase();

  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += (autoRotateSpeed || 1) * delta;
    }
  });

  const onLoadedHandler = () => {
    onLoaded?.();
  };

  const ModelComponent = () => {
    switch (ext) {
      case "glb":
      case "gltf":
        return <GltfContent url={url} onLoaded={onLoadedHandler} />;
      case "fbx":
        return <FbxContent url={url} onLoaded={onLoadedHandler} />;
      case "obj":
        return <ObjContent url={url} onLoaded={onLoadedHandler} />;
      default:
        return null;
    }
  };

  return (
    <Center>
      <group ref={modelRef}>
        <ModelComponent />
      </group>
    </Center>
  );
};

// ---
// Main Viewer Component
// ---

const ModelViewer: FC<ViewerProps> = ({
  url,
  width = "100%",
  height = "100%",
  defaultZoom = 2,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableManualRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.3,
  keyLightIntensity = 1,
  fillLightIntensity = 0.5,
  rimLightIntensity = 0.8,
  environmentPreset = "forest",
  autoRotate = false,
  autoRotateSpeed = 0.35,
  onModelLoaded,
}) => {
  // Preload hook calls should also be unconditional.
  // The 'useGLTF.preload' hook is called here, but if you had other preloaders,
  // they would need to be handled similarly.
  // We'll call useGLTF.preload unconditionally, but it's only effective for gltf/glb files.
  useEffect(() => void useGLTF.preload(url), [url]);

  return (
    <div style={{ width, height }} className="relative">
      <Canvas
        shadows
        camera={{
          fov: 50,
          position: [0, 0, defaultZoom],
          near: 0.01,
          far: 100,
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        frameloop="demand"
      >
        <Suspense fallback={<Loader />}>
          <SceneContent
            url={url}
            autoRotate={autoRotate}
            autoRotateSpeed={deg2rad(autoRotateSpeed)}
            onLoaded={onModelLoaded}
          />
        </Suspense>

        {environmentPreset !== "none" && (
          <Environment preset={environmentPreset as any} />
        )}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={keyLightIntensity}
          castShadow
        />
        <directionalLight
          position={[-5, 2, 5]}
          intensity={fillLightIntensity}
        />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.35}
          scale={10}
          blur={2}
        />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={enableManualRotation}
          enableZoom={enableManualZoom}
          minDistance={minZoomDistance}
          maxDistance={maxZoomDistance}
          autoRotate={isTouch ? false : autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
