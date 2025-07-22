/// <reference types="webxr" />
import { WebGLRenderer } from 'three';
declare const ARButton: {
    createButton(renderer: WebGLRenderer, sessionInit?: XRSessionInit): HTMLButtonElement | HTMLAnchorElement;
};
export { ARButton };
