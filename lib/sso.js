/**
 * Cross-Domain SSO Utility
 * 
 * Handles single sign-on and sign-out synchronization between:
 * - lightswind.com (normal site)
 * - pro.lightswind.com (pro site)
 */

const NORMAL_SITE_URL = "https://lightswind.com";
const PRO_SITE_URL = "https://pro.lightswind.com";

// Local dev ports
const DEV_NORMAL_PORT = "3000";
const DEV_PRO_PORT = "3001";

export function getOtherSiteUrl() {
  if (typeof window === "undefined") return PRO_SITE_URL;
  const { hostname, port } = window.location;

  // Local development: different ports on localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    if (port === DEV_PRO_PORT) return `http://localhost:${DEV_NORMAL_PORT}`;
    return `http://localhost:${DEV_PRO_PORT}`;
  }

  // Production
  if (hostname.includes("pro.lightswind.com")) return NORMAL_SITE_URL;
  return PRO_SITE_URL;
}

export function getThisSiteApiUrl() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export async function syncLoginToOtherSite(firebaseUser) {
  if (!firebaseUser) return;
  if (typeof window === "undefined") return;

  try {
    const idToken = await firebaseUser.getIdToken(true);

    const response = await fetch("/api/auth/sso-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      console.warn("[SSO] Failed to get custom token:", await response.text());
      return;
    }

    const { customToken } = await response.json();
    if (!customToken) return;

    const otherSiteUrl = getOtherSiteUrl();
    const ssoUrl = `${otherSiteUrl}/sso?token=${encodeURIComponent(customToken)}`;

    silentSSOSync(ssoUrl);

    console.log("[SSO] Cross-site login sync initiated →", otherSiteUrl);
  } catch (err) {
    console.warn("[SSO] Cross-site sync failed (non-critical):", err);
  }
}

export async function syncLogoutToOtherSite() {
  if (typeof window === "undefined") return;

  const otherSiteUrl = getOtherSiteUrl();
  const logoutUrl = `${otherSiteUrl}/sso?logout=true`;

  try {
    silentSSOSync(logoutUrl);
    console.log("[SSO] Cross-site logout sync initiated →", otherSiteUrl);
  } catch (err) {
    console.warn("[SSO] Cross-site logout sync failed (non-critical):", err);
  }
}

function silentSSOSync(url) {
  const existing = document.getElementById("__lightswind_sso_bridge__");
  if (existing) existing.remove();

  const iframe = document.createElement("iframe");
  iframe.id = "__lightswind_sso_bridge__";
  iframe.src = url;
  iframe.style.cssText = "position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none;";
  iframe.setAttribute("aria-hidden", "true");

  iframe.onload = () => {
    setTimeout(() => {
      iframe.remove();
    }, 3000);
  };

  document.body.appendChild(iframe);
}
