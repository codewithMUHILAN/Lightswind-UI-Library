import React from "react";

export interface AnimatedOceanWavesProps {
  /** Height of the ocean container (CSS value, e.g. '5%', '80px') */
  height?: string;
  /** Background color or gradient for the ocean container */
  oceanBackground?: string;
  /** Wave SVG url (default is the blue wave) */
  waveImageUrl?: string;
  /** Wave animation duration in seconds */
  waveDuration?: number;
  /** Offset between the two wave layers (in px, for parallax effect) */
  waveOffset?: number;
  /** Opacity of the front/back wave layers */
  frontWaveOpacity?: number;
  backWaveOpacity?: number;
  /** Additional container className */
  className?: string;
  /** Additional inline style for the outer container */
  style?: React.CSSProperties;
  /** Z-index of the ocean (allows layering) */
  zIndex?: number;
}

const DEFAULT_WAVE_IMAGE = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg";

export const AnimatedOceanWaves: React.FC<AnimatedOceanWavesProps> = ({
  height = "5%",
  oceanBackground,
  waveImageUrl = DEFAULT_WAVE_IMAGE,
  waveDuration = 7,
  waveOffset = 23, // offset in px between the two layers
  frontWaveOpacity = 1,
  backWaveOpacity = 1,
  className = "",
  style,
  zIndex = 1
}) => {
  // Inline styles for container and waves
  const oceanStyles: React.CSSProperties = {
    height,
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    background: oceanBackground,
    zIndex,
    ...style,
  };

  const waveStyles: React.CSSProperties = {
    // String concatenation for background image URL
    background: "url(" + waveImageUrl + ") repeat-x",
    position: "absolute",
    top: 0,
    width: "6400px",
    height: "198px",
    // String concatenation for animation property
    animation: "waveAnim " + waveDuration + "s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
    transform: "translate3d(0, 0, 0)",
    opacity: frontWaveOpacity,
    pointerEvents: "none"
  };

  const backWaveStyles: React.CSSProperties = {
    ...waveStyles,
    top: -waveOffset,
    opacity: backWaveOpacity,
    // String concatenation for combined animation property
    animation: "waveAnim " + waveDuration + "s cubic-bezier(0.36, 0.45, 0.63, 0.53) -" + (waveDuration * 0.018) + "s infinite, " +
               "swellAnim " + waveDuration + "s ease -" + (waveDuration * 0.18) + "s infinite"
  };

  return (
    <div className={className} style={oceanStyles} aria-hidden="true">
      {/* Keyframes style tag for animation - standard string for CSS */}
      <style>
        {"@keyframes waveAnim {" +
         "0% { margin-left: 0; }" +
         "100% { margin-left: -1600px; }" +
         "}" +
         "@keyframes swellAnim {" +
         "0%, 100% { transform: translate3d(0, -25px, 0);}" +
         "50% { transform: translate3d(0, 5px, 0);}" +
         "}"}
      </style>
      <div style={waveStyles}></div>
      <div style={backWaveStyles}></div>
    </div>
  );
};

export default AnimatedOceanWaves;