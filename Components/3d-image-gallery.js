import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
const ThreeDImageGallery = ({ images = [
    'https://images.pexels.com/photos/2514035/pexels-photo-2514035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1271620/pexels-photo-1271620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
], width = 800, height = 600, boxWidth = 1, boxHeight = 1.4, parallaxStrength = 0.3, animationSpeed = 3, spacing = 1, rotationAngle = 0.1, borderRadius = 0.08, edgeSoftness = 0.001, autoRotate = false, autoRotateSpeed = 0.5, ambientLightIntensity = 0.5, enableMouseControl = true, enableTouchControl = true, perspective = 75, cameraDistance = 3, backgroundColor = 'transparent', className = '', style = {}, onImageClick, onSceneReady }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const planeGroupRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2());
    const clockRef = useRef(new THREE.Clock());
    const raycasterRef = useRef(new THREE.Raycaster());
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (!mountRef.current)
            return;
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(perspective, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor(backgroundColor === 'transparent' ? 0x000000 : backgroundColor, backgroundColor === 'transparent' ? 0 : 1);
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);
        scene.add(camera);
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
        scene.add(ambientLight);
        // Geometry
        const planeGeometry = new THREE.PlaneGeometry(boxWidth, boxHeight);
        const planeGroup = new THREE.Group();
        // Create rounded plane function
        const createRoundedPlane = (texture) => {
            const material = new THREE.MeshMatcapMaterial({
                matcap: texture,
                transparent: true,
            });
            material.onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace('#include <common>', `
            #include <common>
            varying vec4 vPosition;
            varying vec2 vUv;
          `);
                shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>', `
            #include <fog_vertex>
            vPosition = mvPosition;
            vUv = uv;
          `);
                shader.fragmentShader = shader.fragmentShader.replace(`#include <common>`, `
            #include <common>
            varying vec4 vPosition;
            varying vec2 vUv;
            float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
              return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
            }
          `);
                shader.fragmentShader = shader.fragmentShader.replace(`#include <dithering_fragment>`, `
            #include <dithering_fragment>
            vec2 size = vec2(1.0, 1.0);
            float edgeSoftness = ${edgeSoftness.toFixed(6)};
            float radius = ${borderRadius.toFixed(6)};
            float distance = roundedBoxSDF(vUv.xy - (size/2.0), size/2.0, radius);
            float smoothedAlpha = 1.0-smoothstep(0.0, edgeSoftness * 2.0, distance);
            gl_FragColor = vec4(outgoingLight, smoothedAlpha);
          `);
            };
            return new THREE.Mesh(planeGeometry, material);
        };
        // Load textures and create planes
        const textureLoader = new THREE.TextureLoader();
        const loadPromises = images.map((imageSrc, index) => {
            return new Promise((resolve) => {
                textureLoader.load(imageSrc, (texture) => {
                    const plane = createRoundedPlane(texture);
                    const offset = (index - (images.length - 1) / 2) * spacing;
                    plane.position.set(offset, 0, index === Math.floor(images.length / 2) ? 0.5 : 1);
                    plane.rotation.y = index === 0 ? Math.PI * rotationAngle :
                        index === images.length - 1 ? Math.PI * -rotationAngle : 0;
                    plane.userData = { index };
                    planeGroup.add(plane);
                    resolve();
                });
            });
        });
        Promise.all(loadPromises).then(() => {
            scene.add(planeGroup);
            setIsReady(true);
            onSceneReady?.();
        });
        // Mouse/Touch handling
        const handlePointerMove = (clientX, clientY) => {
            if (!enableMouseControl && !enableTouchControl)
                return;
            mouseRef.current.x = (clientX / width) * 2 - 1;
            mouseRef.current.y = -((clientY / height) * 2 - 1);
        };
        const handleClick = (event) => {
            if (!onImageClick || !planeGroupRef.current || !cameraRef.current)
                return;
            const clientX = 'touches' in event ? event.touches[0]?.clientX : event.clientX;
            const clientY = 'touches' in event ? event.touches[0]?.clientY : event.clientY;
            if (!clientX || !clientY)
                return;
            const rect = mountRef.current?.getBoundingClientRect();
            if (!rect)
                return;
            const mouse = new THREE.Vector2();
            mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            raycasterRef.current.setFromCamera(mouse, cameraRef.current);
            const intersects = raycasterRef.current.intersectObjects(planeGroupRef.current.children);
            if (intersects.length > 0) {
                const clickedPlane = intersects[0].object;
                onImageClick(clickedPlane.userData.index);
            }
        };
        // Event listeners
        if (enableMouseControl) {
            mountRef.current.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
            mountRef.current.addEventListener('click', handleClick);
        }
        if (enableTouchControl) {
            mountRef.current.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (e.touches[0]) {
                    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: false });
            mountRef.current.addEventListener('touchstart', handleClick);
        }
        // Animation loop
        let previousTime = 0;
        const animate = () => {
            const elapsedTime = clockRef.current.getElapsedTime();
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;
            if (planeGroup) {
                if (autoRotate) {
                    planeGroup.rotation.y += autoRotateSpeed * deltaTime;
                }
                else if (enableMouseControl || enableTouchControl) {
                    const parallaxX = mouseRef.current.x * -parallaxStrength;
                    const parallaxY = mouseRef.current.y * parallaxStrength;
                    planeGroup.rotation.y += (parallaxX - planeGroup.rotation.y) * animationSpeed * deltaTime;
                    planeGroup.rotation.x += (parallaxY - planeGroup.rotation.x) * animationSpeed * deltaTime;
                }
            }
            renderer.render(scene, camera);
        };
        renderer.setAnimationLoop(animate);
        mountRef.current.appendChild(renderer.domElement);
        // Store refs
        sceneRef.current = scene;
        rendererRef.current = renderer;
        cameraRef.current = camera;
        planeGroupRef.current = planeGroup;
        // Cleanup
        return () => {
            renderer.setAnimationLoop(null);
            renderer.dispose();
            planeGeometry.dispose();
            scene.clear();
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [
        images, width, height, boxWidth, boxHeight, parallaxStrength, animationSpeed,
        spacing, rotationAngle, borderRadius, edgeSoftness, autoRotate, autoRotateSpeed,
        ambientLightIntensity, enableMouseControl, enableTouchControl, perspective,
        cameraDistance, backgroundColor
    ]);
    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (!rendererRef.current || !cameraRef.current)
                return;
            const newWidth = mountRef.current?.clientWidth || width;
            const newHeight = mountRef.current?.clientHeight || height;
            cameraRef.current.aspect = newWidth / newHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [width, height]);
    return (_jsx("div", { ref: mountRef, className: `3d-image-gallery ${className}`, style: {
            width: '100%',
            height: '100%',
            minWidth: width,
            minHeight: height,
            overflow: 'hidden',
            ...style
        }, "aria-label": "3D Image Gallery", role: "img" }));
};
export default ThreeDImageGallery;
