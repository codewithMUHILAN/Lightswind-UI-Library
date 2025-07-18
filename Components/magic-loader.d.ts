import React from 'react';
interface MagicLoaderProps {
    size?: number;
    particleCount?: number;
    speed?: number;
    hueRange?: [number, number];
    className?: string;
}
declare const MagicLoader: React.FC<MagicLoaderProps>;
export default MagicLoader;
