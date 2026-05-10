import { db } from "../app/config/config";
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, doc, getDoc, setDoc } from "firebase/firestore";

export interface AnalyticsEvent {
    id?: string;
    path: string;
    sessionId: string;
    country?: string;
    city?: string;
    deviceType: 'mobile' | 'desktop' | 'tablet' | 'unknown';
    browser?: string;
    os?: string;
    timestamp: number;
    referrer?: string;
    ip?: string;
    region?: string;
}

export interface PageViewStats {
    path: string;
    views: number;
    uniqueVisitors: number;
}

export type SiteType = 'pro' | 'ui';

export const AnalyticsService = {
    recordView: async (event: AnalyticsEvent, site: SiteType = 'ui') => {
        // 🛡️ SYSTEM PAUSED: No data recording allowed
        return;
    },

    getStats: async (days = 7, site: SiteType = 'ui') => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);
        const collectionBase = site === 'pro' ? "lightswind-analytics-pro" : "lightswind-analytics-ui";

        try {
            // Fetch Page Views
            const pageViewsQuery = query(
                collection(db, collectionBase, "pageViews", "data"),
                where("timestamp", ">=", cutoffTimestamp),
                orderBy("timestamp", "desc")
            );
            const pageViewsSnapshot = await getDocs(pageViewsQuery);

            // Fetch Sessions for location data
            const sessionsQuery = query(
                collection(db, collectionBase, "sessions", "data"),
                where("startTime", ">=", cutoffTimestamp)
            );
            const sessionsSnapshot = await getDocs(sessionsQuery);

            const sessionsMap = new Map();
            sessionsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                sessionsMap.set(data.sessionId, data);
            });

            const events: AnalyticsEvent[] = pageViewsSnapshot.docs.map(doc => {
                const data = doc.data();
                const session = sessionsMap.get(data.sessionId);

                return {
                    id: doc.id,
                    path: data.pagePath || "/",
                    sessionId: data.sessionId,
                    timestamp: data.timestamp?.toDate()?.getTime() || Date.now(),
                    browser: data.deviceInfo?.browser || "Other",
                    os: data.deviceInfo?.os || "Other",
                    deviceType: (data.deviceInfo?.device?.toLowerCase() || "desktop") as any,
                    country: session?.location?.country || "Earth",
                    city: session?.location?.city || "Unknown",
                    region: session?.location?.region || "Unknown",
                    ip: session?.location?.ip || "---",
                    referrer: session?.referrer || "Direct"
                };
            });

            return events;
        } catch (error: any) {
            console.error(`[AnalyticsService] Failed to fetch stats for ${site}.`, error);
            return [];
        }
    },

    getSettings: async (site: SiteType = 'ui') => {
        // 🛡️ SYSTEM PAUSED
        return { enabled: false };
    },

    toggleAnalytics: async (enabled: boolean, site: SiteType = 'ui') => {
        // 🛡️ SYSTEM PAUSED: Toggle disabled
        return false;
    }
};
