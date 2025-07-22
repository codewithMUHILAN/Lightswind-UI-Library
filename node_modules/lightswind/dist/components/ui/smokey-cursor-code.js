const smokeyCursorSnippet = `import { SmokeyCursor } from "@/components/ui/smokey-cursor";

export function SmokeyCursorExample() {
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
      {/* Your content goes here */}
      <h1 className="relative z-10 p-4 text-center text-white text-2xl">
        Move your cursor around
      </h1>
      
      <SmokeyCursor 
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2.0}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        BACK_COLOR={{ r: 0.5, g: 0, b: 0 }}
        TRANSPARENT={true}
      />
    </div>
  );
}`;
export default smokeyCursorSnippet;
