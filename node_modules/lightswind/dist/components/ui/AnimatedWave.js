"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import { cn } from '../lib/utils'; // Assuming this utility is correctly set up
const getDeviceInfo = () => {
    return {
        screenWidth: () => Math.max(0, window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth ||
            0),
        screenHeight: () => Math.max(0, window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight ||
            0),
        screenRatio: function () {
            return this.screenWidth() / this.screenHeight();
        },
        screenCenterX: function () {
            return this.screenWidth() / 2;
        },
        screenCenterY: function () {
            return this.screenHeight() / 2;
        },
        mouseCenterX: function (e) {
            // Return mouse X position relative to the center of the screen
            // This maps 0,0 to the center, negative left, positive right
            return e.clientX - this.screenCenterX();
        },
        mouseCenterY: function (e) {
            // Return mouse Y position relative to the center of the screen
            // This maps 0,0 to the center, negative up, positive down
            return e.clientY - this.screenCenterY();
        },
    };
};
const addEase = (pos, to, ease) => {
    pos.x += (to.x - pos.x) / ease;
    pos.y += (to.y - pos.y) / ease;
    pos.z += (to.z - pos.z) / ease;
};
const getElementBackground = (element) => {
    let currentElement = element;
    while (currentElement) {
        const style = getComputedStyle(currentElement);
        const bgColor = style.backgroundColor;
        if (bgColor &&
            bgColor !== "rgba(0, 0, 0, 0)" &&
            bgColor !== "transparent") {
            return bgColor;
        }
        currentElement = currentElement.parentElement;
    }
    return null;
};
const parseColor = (color) => {
    try {
        return new THREE.Color(color);
    }
    catch (error) {
        if (color.startsWith("rgb")) {
            const matches = color.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return new THREE.Color(parseInt(matches[0]) / 255, parseInt(matches[1]) / 255, parseInt(matches[2]) / 255);
            }
        }
        console.warn(`Could not parse color: ${color}. Falling back to white.`);
        return new THREE.Color(0xffffff); // Default fallback
    }
};
/**
 * Determines if a color is "dark" based on its luminance.
 * A common threshold for perceived brightness is used.
 * @param color A Three.js Color object.
 * @returns True if the color is dark, false if it's light.
 */
const isColorDark = (color) => {
    // Calculate luminance (perceived brightness)
    // Formula: L = 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
    // A threshold of 0.5 is common, lower values mean 'darker'
    return luminance < 0.5;
};
// --- Main Component ---
const AnimatedWave = ({ className, speed = 0.015, amplitude = 30, smoothness = 300, wireframe = true, waveColor, opacity = 1, mouseInteraction = true, quality = 'medium', fov = 60, waveOffsetY = -300, waveRotation = 29.8, cameraDistance = -1000, autoDetectBackground = true, backgroundColor, ease = 12, mouseDistortionStrength = 0.5, mouseDistortionSmoothness = 100, mouseDistortionDecay = 0.0005, mouseShrinkScaleStrength = 0.7, mouseShrinkScaleRadius = 200, }) => {
    const containerRef = useRef(null);
    const sceneElementsRef = useRef({
        scene: null,
        camera: null,
        renderer: null,
        groundPlain: null,
        animationFrameId: null,
        mouse: { x: 0, y: 0 },
    });
    const [webGLFailed, setWebGLFailed] = useState(false);
    // Determine the number of segments for the plane geometry based on quality prop
    const getQualitySettings = useCallback((quality) => {
        switch (quality) {
            case "low":
                return { width: 64, height: 32 }; // Fewer vertices, faster
            case "high":
                return { width: 256, height: 128 }; // More vertices, higher detail, slower
            default: // medium
                return { width: 128, height: 64 }; // Balanced
        }
    }, []);
    /**
     * Determines the wave color.
     * If waveColor is provided, it's used directly.
     * If autoDetectBackground is true, it attempts to find a contrasting color based on parent background.
     * Otherwise, it defaults to a sensible fallback (black for light, white for dark).
     */
    const determineWaveColor = useCallback(() => {
        if (waveColor) {
            return parseColor(waveColor); // Explicit color always wins
        }
        if (autoDetectBackground && containerRef.current) {
            const detectedBg = getElementBackground(containerRef.current);
            if (detectedBg) {
                const parsedBgColor = parseColor(detectedBg);
                if (isColorDark(parsedBgColor)) {
                    return new THREE.Color(0xffffff); // White wave for dark background
                }
                else {
                    return new THREE.Color(0x000000); // Black wave for light background
                }
            }
        }
        // Default based on assumed common scenario (light background -> dark wave)
        // Or you could make this a prop for more control: `defaultWaveColor`
        // For a typical website, default background is light, so default wave should be dark.
        // If you expect dark mode by default, change this to 0xffffff.
        // Here, we'll default to black assuming a light container, and let auto-detect handle dark mode.
        return new THREE.Color(0x000000); // Default to black wave
    }, [waveColor, autoDetectBackground]);
    // Function to create and manage the ground plain (the wave)
    const createGroundPlain = useCallback(() => {
        const { width: geometryWidth, height: geometryHeight } = getQualitySettings(quality);
        const groundPlain = {
            group: null,
            geometry: null,
            material: null,
            plane: null,
            simplex: null, // Simplex noise generator
            factor: smoothness, // Controls the "wavelength" of the noise
            scale: amplitude, // Controls the "height" of the noise
            speed: speed, // Controls how fast the wave moves over time
            cycle: 0, // Time counter for wave animation
            ease: ease, // Easing factor for plane movement
            // Initial position of the entire wave group in 3D space
            move: new THREE.Vector3(0, waveOffsetY, cameraDistance),
            // Initial rotation of the entire wave group
            look: new THREE.Vector3((waveRotation * Math.PI) / 180, 0, 0), // Convert degrees to radians for X-axis rotation
            // Mouse distortion properties
            mouseDistortionStrength: mouseDistortionStrength,
            mouseDistortionSmoothness: mouseDistortionSmoothness,
            mouseDistortionDecay: mouseDistortionDecay,
            distortionTime: 0, // Time counter for mouse ripple decay
            // Mouse shrink/scale properties
            mouseShrinkScaleStrength: mouseShrinkScaleStrength,
            mouseShrinkScaleRadius: mouseShrinkScaleRadius,
            // Store original vertex positions to apply transformations from a constant base
            _originalPositions: new Float32Array(),
            create: function (scene) {
                // Create a new Three.js Group to hold the plane, allowing easier positioning/rotation
                this.group = new THREE.Object3D();
                this.group.position.copy(this.move);
                this.group.rotation.copy(this.look);
                // Define the plane geometry (width, height, segmentsX, segmentsY)
                this.geometry = new THREE.PlaneGeometry(4000, // Width of the plane in Three.js units
                2000, // Height of the plane in Three.js units
                geometryWidth, // Number of horizontal segments (vertices)
                geometryHeight // Number of vertical segments (vertices)
                );
                // CRUCIAL: Store the initial (undistorted) vertex positions
                // This array will be used as the base for all calculations in moveNoise.
                this._originalPositions = new Float32Array(this.geometry.attributes.position.array);
                // Set up the material for the plane
                const waveColorValue = determineWaveColor();
                this.material = new THREE.MeshLambertMaterial({
                    color: waveColorValue,
                    opacity: opacity,
                    blending: opacity < 1 ? THREE.NormalBlending : THREE.NoBlending, // Correct blending for transparency
                    side: THREE.DoubleSide, // Render both front and back faces (important for wireframe)
                    transparent: opacity < 1, // Enable transparency if opacity < 1
                    depthWrite: opacity < 1 ? false : true, // Disable depth writes for transparent objects to prevent artifacts
                    wireframe: wireframe, // Show as wireframe or solid mesh
                });
                // Create the mesh (geometry + material)
                this.plane = new THREE.Mesh(this.geometry, this.material);
                this.plane.position.set(0, 0, 0); // Position the plane at the center of its group
                // Initialize Simplex noise generator
                this.simplex = createNoise2D();
                // Perform initial noise calculation (no mouse influence initially)
                this.moveNoise({ x: 0, y: 0 });
                this.group.add(this.plane); // Add the plane to the group
                scene.add(this.group); // Add the group to the scene
            },
            // Function to calculate and apply noise (wave + mouse effects) to vertices
            moveNoise: function (mouse) {
                if (!this.geometry || !this.simplex || !this._originalPositions)
                    return;
                const positions = this.geometry.attributes.position; // Get the position attribute of the geometry
                const currentMouseX = mouseInteraction ? mouse.x : 0;
                const currentMouseY = mouseInteraction ? mouse.y : 0;
                // Increment the time factor for mouse distortion decay
                this.distortionTime += this.mouseDistortionDecay;
                // Loop through all vertices
                for (let i = 0; i < positions.count; i++) {
                    // Retrieve original (undistorted) X and Y coordinates for the current vertex
                    const originalX = this._originalPositions[i * 3];
                    const originalY = this._originalPositions[i * 3 + 1];
                    // Initialize newX, newY, and zOffset with values based on original positions
                    let newX = originalX;
                    let newY = originalY;
                    // --- 1. Base Wave Effect (Z-axis displacement) ---
                    // Use originalX and originalY to calculate noise.
                    // `this.factor` (smoothness) controls the "wavelength".
                    // `this.cycle` provides the time-based animation.
                    const xoff_wave = originalX / this.factor;
                    const yoff_wave = originalY / this.factor + this.cycle;
                    let zOffset = this.simplex(xoff_wave, yoff_wave) * this.scale; // `this.scale` (amplitude) controls height.
                    // --- 2. Mouse Distortion / Wobble Effect (Additional Z-axis displacement) ---
                    if (mouseInteraction && this.mouseDistortionStrength > 0) {
                        // Calculate distance of the original vertex from the mouse position.
                        // The `* 0.5` on currentMouseX/Y helps in centering the effect if needed.
                        const distX_mouse = originalX - currentMouseX * 0.5;
                        const distY_mouse = originalY - currentMouseY * 0.5;
                        const dist_mouse = Math.sqrt(distX_mouse * distX_mouse + distY_mouse * distY_mouse);
                        // Generate a 3D Simplex noise value for the ripple.
                        // `this.distortionTime` makes the ripple evolve over time.
                        const mouseRippleNoise = this.simplex(distX_mouse / this.mouseDistortionSmoothness, // Smoothness of the mouse ripple
                        distY_mouse / this.mouseDistortionSmoothness, this.distortionTime // Third dimension for time-based evolution
                        ) * this.mouseDistortionStrength; // Overall strength of the mouse ripple
                        // Apply a falloff (diminishing effect) as the vertex gets further from the mouse.
                        // The effect diminishes further from the mouse. Factor of 2 on radius for wider spread.
                        const zFalloff = Math.max(0, 1 - dist_mouse / (this.mouseShrinkScaleRadius * 2));
                        // Add the mouse-induced ripple to the base Z offset, scaled by falloff
                        zOffset += mouseRippleNoise * this.scale * zFalloff;
                    }
                    // --- 3. Mouse Shrink/Scale Effect (X & Y axis displacement) ---
                    // This creates the "grid lines converging/expanding" visual.
                    if (mouseInteraction && this.mouseShrinkScaleStrength > 0) {
                        // Calculate distance of the original vertex from the exact mouse position
                        const distX_shrink = originalX - currentMouseX;
                        const distY_shrink = originalY - currentMouseY;
                        const dist_shrink = Math.sqrt(distX_shrink * distX_shrink + distY_shrink * distY_shrink);
                        let shrinkFalloff = 0;
                        // Only apply effect if within the defined radius
                        if (dist_shrink < this.mouseShrinkScaleRadius) {
                            // Calculate a normalized falloff: 1 at mouse center, 0 at radius edge
                            shrinkFalloff = 1 - (dist_shrink / this.mouseShrinkScaleRadius);
                            // Apply a power curve for a smoother ease-out effect (strongest near mouse, fades out gracefully)
                            shrinkFalloff = Math.pow(shrinkFalloff, 2);
                        }
                        // Calculate the total amount to move the vertex towards the mouse.
                        // Positive shrinkAmount pulls towards the mouse, creating a "shrink".
                        const shrinkAmount = this.mouseShrinkScaleStrength * shrinkFalloff;
                        // Update newX and newY based on the original positions,
                        // moving them towards the mouse by the calculated shrinkAmount.
                        newX = originalX - distX_shrink * shrinkAmount;
                        newY = originalY - distY_shrink * shrinkAmount;
                    }
                    // Update the vertex position in the geometry's attribute buffer
                    positions.setXYZ(i, newX, newY, zOffset);
                }
                // Mark the positions attribute as needing an update for Three.js to re-render it
                positions.needsUpdate = true;
                this.cycle += this.speed; // Advance the wave animation cycle
            },
            update: function (mouse) {
                this.moveNoise(mouse);
                if (mouseInteraction && this.group) {
                    // Fix mouse direction: invert X to match natural movement and correct Y direction
                    this.move.x = -(mouse.x * 0.04);
                    this.move.y = waveOffsetY + (mouse.y * 0.04); // Add Y movement with corrected direction
                    addEase(this.group.position, this.move, this.ease);
                    addEase(this.group.rotation, this.look, this.ease);
                }
            },
            // Clean up Three.js resources when the component unmounts or scene is re-setup
            dispose: function () {
                this.geometry?.dispose();
                this.material?.dispose();
                this.group?.remove(this.plane);
                this.plane = null;
                this.geometry = null;
                this.material = null;
                this.simplex = null;
                this.group = null;
                this._originalPositions = new Float32Array(); // Clear the reference
            },
        };
        return groundPlain;
    }, [
        // Dependencies for useCallback, ensuring function is re-created if these change
        quality,
        smoothness,
        amplitude,
        speed,
        ease,
        waveOffsetY,
        cameraDistance,
        waveRotation,
        determineWaveColor, // Use the new function
        opacity,
        wireframe,
        mouseInteraction,
        getQualitySettings,
        mouseDistortionStrength,
        mouseDistortionSmoothness,
        mouseDistortionDecay,
        mouseShrinkScaleStrength,
        mouseShrinkScaleRadius,
    ]);
    // Main setup function for the Three.js scene
    const setupScene = useCallback(() => {
        if (!containerRef.current) {
            console.warn("Container ref not available, cannot setup scene.");
            return;
        }
        // --- Start Cleanup of previous scene (if any) ---
        // This is vital for React's strict mode and fast refresh,
        // preventing multiple scenes/renderers from running simultaneously.
        if (sceneElementsRef.current.renderer) {
            console.log("Cleaning up existing Three.js scene before re-setup.");
            if (sceneElementsRef.current.animationFrameId) {
                cancelAnimationFrame(sceneElementsRef.current.animationFrameId); // Stop previous animation loop
            }
            sceneElementsRef.current.groundPlain?.dispose(); // Dispose Three.js geometries/materials
            sceneElementsRef.current.renderer.dispose(); // Dispose the renderer
            sceneElementsRef.current.scene?.clear(); // Clear all objects from the scene
            // Remove the canvas element from the DOM
            if (containerRef.current.contains(sceneElementsRef.current.renderer.domElement)) {
                containerRef.current.removeChild(sceneElementsRef.current.renderer.domElement);
            }
            // Reset the ref state to nulls
            sceneElementsRef.current = {
                scene: null,
                camera: null,
                renderer: null,
                groundPlain: null,
                animationFrameId: null,
                mouse: { x: 0, y: 0 },
            };
        }
        // --- End Cleanup ---
        const container = containerRef.current;
        const device = getDeviceInfo();
        // 1. Create Scene
        const scene = new THREE.Scene();
        // 2. Create Camera
        const camera = new THREE.PerspectiveCamera(fov, // Field of View (vertical)
        device.screenRatio(), // Aspect Ratio (width/height)
        0.1, // Near clipping plane
        20000 // Far clipping plane (objects beyond this are not rendered)
        );
        // 3. Create Renderer
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                alpha: true, // Enable transparency for the canvas
                antialias: true, // Smooths jagged edges
                precision: "mediump", // Shader precision
            });
            renderer.setSize(device.screenWidth(), device.screenHeight()); // Set renderer size to full screen
            renderer.setPixelRatio(window.devicePixelRatio); // Use device's pixel ratio for sharpness
            renderer.setClearColor(0x000000, 0); // Transparent background for the Three.js canvas
            container.appendChild(renderer.domElement); // Add the canvas to the container div
            setWebGLFailed(false); // Clear any previous WebGL failure state
        }
        catch (e) {
            console.error("Failed to create WebGL context:", e);
            setWebGLFailed(true); // Set error state if WebGL initialization fails
            return; // Stop execution if renderer cannot be created
        }
        // 4. Add Lights
        const waveColorValue = determineWaveColor(); // Use the new function for light color
        const pointLight = new THREE.PointLight(waveColorValue, 4, 1000); // Color, Intensity, Distance
        pointLight.position.set(0, 200, -500); // Position the light source
        scene.add(pointLight);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
        scene.add(ambientLight); // Essential for basic visibility of non-self-illuminating materials
        // 5. Create and Add the Ground Plain (Wave)
        const groundPlain = createGroundPlain();
        groundPlain.create(scene);
        // Store created Three.js elements and state in the ref object
        sceneElementsRef.current = {
            scene,
            camera,
            renderer,
            groundPlain,
            animationFrameId: null,
            mouse: { x: device.screenCenterX(), y: device.screenCenterY() }, // Initialize mouse position to center
        };
        // --- Event Listeners ---
        // Mouse move event for interaction
        const handleMouseMove = (e) => {
            if (!mouseInteraction)
                return; // Only process if mouse interaction is enabled
            if (sceneElementsRef.current) {
                sceneElementsRef.current.mouse.x = device.mouseCenterX(e);
                sceneElementsRef.current.mouse.y = device.mouseCenterY(e);
            }
        };
        if (mouseInteraction) {
            window.addEventListener("mousemove", handleMouseMove);
        }
        // Window resize event for responsiveness
        const handleResize = () => {
            const current = sceneElementsRef.current;
            if (!current || !current.camera || !current.renderer)
                return;
            current.camera.aspect = device.screenRatio(); // Update camera aspect ratio
            current.camera.updateProjectionMatrix(); // Recalculate camera's projection matrix
            current.renderer.setSize(device.screenWidth(), device.screenHeight()); // Resize the renderer canvas
        };
        window.addEventListener("resize", handleResize);
        // --- Animation Loop ---
        const animate = () => {
            const current = sceneElementsRef.current;
            // Ensure all necessary Three.js objects are available before rendering
            if (!current ||
                !current.scene ||
                !current.camera ||
                !current.renderer ||
                !current.groundPlain) {
                return; // Exit if any essential element is missing (e.g., during cleanup)
            }
            current.groundPlain.update(current.mouse); // Update wave geometry based on mouse and time
            current.renderer.render(current.scene, current.camera); // Render the scene from the camera's perspective
            current.animationFrameId = requestAnimationFrame(animate); // Request the next animation frame
        };
        animate(); // Start the animation loop
        // --- Cleanup Function ---
        // This function is returned by useCallback and will be executed when
        // the component unmounts or the setupScene dependency array changes.
        return () => {
            if (mouseInteraction) {
                window.removeEventListener("mousemove", handleMouseMove);
            }
            window.removeEventListener("resize", handleResize);
            const current = sceneElementsRef.current;
            if (current) {
                if (current.animationFrameId) {
                    cancelAnimationFrame(current.animationFrameId); // Stop the animation loop
                }
                current.groundPlain?.dispose(); // Dispose Three.js objects associated with the wave
                current.renderer?.dispose(); // Dispose the WebGL renderer
                current.scene?.clear(); // Clear all objects from the scene
                // Attempt to remove the canvas element from the DOM
                if (containerRef.current?.contains(current.renderer.domElement)) {
                    containerRef.current.removeChild(current.renderer.domElement);
                }
            }
            // Finally, reset the ref state to ensure a clean slate
            sceneElementsRef.current = {
                scene: null,
                camera: null,
                renderer: null,
                groundPlain: null,
                animationFrameId: null,
                mouse: { x: 0, y: 0 },
            };
        };
    }, [
        fov,
        determineWaveColor, // Dependency on the updated function
        createGroundPlain,
        mouseInteraction,
    ]); // Dependencies for useCallback. Changes here trigger re-setup.
    // Effect hook to run setupScene on component mount and handle cleanup
    useEffect(() => {
        const cleanup = setupScene(); // Call the setup function
        return () => {
            cleanup?.(); // Execute the returned cleanup function on unmount/dependency change
        };
    }, [setupScene]); // `setupScene` is a dependency. This hook re-runs if `setupScene` itself changes.
    // Effect hook to update material properties if props change *after* initial setup
    useEffect(() => {
        const current = sceneElementsRef.current;
        if (!current.groundPlain || !current.groundPlain.material || !current.scene)
            return;
        // Use the determined wave color
        const newWaveColor = determineWaveColor();
        current.groundPlain.material.color.copy(newWaveColor);
        current.groundPlain.material.wireframe = wireframe;
        current.groundPlain.material.opacity = opacity;
        current.groundPlain.material.transparent = opacity < 1;
        current.groundPlain.material.depthWrite = opacity < 1 ? false : true;
        current.groundPlain.material.blending =
            opacity < 1 ? THREE.NormalBlending : THREE.NoBlending;
        current.groundPlain.material.needsUpdate = true; // Crucial for material changes to take effect
        // Update the color of the point light as well
        const pointLight = current.scene.children.find((child) => child instanceof THREE.PointLight);
        if (pointLight) {
            pointLight.color.copy(newWaveColor);
        }
    }, [determineWaveColor, wireframe, opacity]); // Dependencies for this effect
    return (
    // Outer div with CSS perspective for a potential overall 3D tilt effect on the HTML container.
    // The Three.js plane's 3D orientation is primarily controlled by `waveRotation` prop.
    _jsx("div", { style: { perspective: "900px" }, children: _jsx("div", { ref: containerRef, className: cn(// `cn` for combining TailwindCSS classes if you have it set up
            "relative inset-0 w-full h-screen z-10 overflow-hidden", className), style: {
                // `pointerEvents: "none"` allows mouse events to "pass through" this div
                // to the window, where the mousemove listener is attached.
                pointerEvents: "none",
                backgroundColor: backgroundColor || "transparent",
                // This CSS transform rotates the HTML div itself, not the 3D scene directly.
                // The 3D plane's rotation is handled by `waveRotation` prop in Three.js.
                //   transform: "rotateX(70deg)",
                //   transformStyle: "preserve-3d", // Required for nested 3D transforms
            }, children: webGLFailed && ( // Display a fallback message if WebGL fails to initialize
            _jsxs("div", { style: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    padding: "20px",
                    borderRadius: "8px",
                    zIndex: 100,
                    textAlign: "center",
                }, children: [_jsx("p", { children: "\uD83D\uDEAB WebGL Error: Unable to render animated wave." }), _jsx("p", { children: "Please ensure your browser and graphics drivers are up to date and hardware acceleration is enabled." })] })) }) }));
};
export default AnimatedWave;
