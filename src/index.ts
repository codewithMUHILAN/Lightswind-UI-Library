// Lightswind UI entry point
export const version: string = __LIGHTSWIND_VERSION__;

const TELEMETRY_URL = "https://pro.lightswind.com/api/npm-telemetry";
const RATE_LIMIT_MS = 604800000; // 7 days

function isTelemetryAllowed(): boolean {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  // Ignore development/local traffic
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local")) {
    return false;
  }

  // Check opt-out
  if ((window as any).LIGHTSWIND_NO_TELEMETRY || navigator.doNotTrack === "1") {
    return false;
  }

  return true;
}

function sendTelemetry(storageKey: string, component: string) {
  try {
    if (!isTelemetryAllowed()) return;

    const lastSent = window.localStorage.getItem(storageKey);
    const now = Date.now();

    if (!lastSent || now - parseInt(lastSent, 10) > RATE_LIMIT_MS) {
      const body = JSON.stringify({ c: component, d: window.location.hostname });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(TELEMETRY_URL, new Blob([body], { type: "application/json" }));
      } else {
        fetch(TELEMETRY_URL, {
          method: "POST",
          body: body,
          mode: "no-cors",
          headers: { "Content-Type": "application/json" }
        }).catch(() => {});
      }
      window.localStorage.setItem(storageKey, now.toString());
    }
  } catch (e) {}
}

// Automatic client-side telemetry to capture the exact live production URL
sendTelemetry("lw_telemetry_registered", "package-init");

export function trackComponent(name: string) {
  sendTelemetry(`lw_tel_${name}`, name);
}
