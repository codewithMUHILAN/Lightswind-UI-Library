"use client";

import { useState, useEffect } from 'react';
import { db } from '../config/config';
import { collection, query, where, onSnapshot, orderBy, limit, Timestamp, doc } from 'firebase/firestore';

// Hook for real-time analytics dashboard
export const useRealtimeAnalytics = () => {
    const [activeVisitors, setActiveVisitors] = useState(0);
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [todayStats, setTodayStats] = useState({
        pageViews: 0,
        sessions: 0,
        blockViews: 0,
        blockCopies: 0,
        blockDownloads: 0,
    });
    const [allActiveSessions, setAllActiveSessions] = useState<any[]>([]);

    useEffect(() => {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        const sessionsQuery = query(
            collection(db, 'lightswind-analytics-ui', 'sessions', 'data'),
            where('isActive', '==', true),
            where('lastActivity', '>', Timestamp.fromDate(tenMinutesAgo))
        );

        const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
            const sessions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllActiveSessions(sessions);
        }, (error) => {
            console.error('Error fetching active sessions:', error);
        });

        const pageViewsQuery = query(
            collection(db, 'lightswind-analytics-ui', 'pageViews', 'data'),
            orderBy('timestamp', 'desc'),
            limit(10)
        );

        const unsubscribePageViews = onSnapshot(pageViewsQuery, (snapshot) => {
            const events = snapshot.docs.map(doc => ({
                id: doc.id,
                type: 'pageView',
                ...doc.data(),
            }));
            setRecentEvents(events);
        }, (error) => {
            console.error('Error fetching recent page views:', error);
        });

        const today = new Date().toISOString().split('T')[0];
        const statsDocRef = doc(db, 'lightswind-analytics-ui', 'dailyStats', 'data', today);

        const unsubscribeStats = onSnapshot(statsDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTodayStats({
                    pageViews: data.pageViews || 0,
                    sessions: data.sessions || 0,
                    blockViews: data.blockViews || 0,
                    blockCopies: data.blockCopies || 0,
                    blockDownloads: data.blockDownloads || 0,
                });
            }
        }, (error) => {
            console.error('Error fetching today stats:', error);
        });

        return () => {
            unsubscribeSessions();
            unsubscribePageViews();
            unsubscribeStats();
        };
    }, []);

    useEffect(() => {
        const updateCount = () => {
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            const count = allActiveSessions.filter(session => {
                const lastActive = session.lastActivity?.toDate()?.getTime() || 0;
                return lastActive > fiveMinutesAgo;
            }).length;
            setActiveVisitors(count);
        };

        updateCount();
        const interval = setInterval(updateCount, 30000);
        return () => clearInterval(interval);
    }, [allActiveSessions]);

    const liveSessions = Array.from(
        allActiveSessions
            .filter(session => {
                const lastActive = session.lastActivity?.toDate()?.getTime() || 0;
                return lastActive > (Date.now() - 5 * 60 * 1000);
            })
            .reduce((map, session) => {
                const existing = map.get(session.sessionId);
                if (!existing || (session.lastActivity?.toDate()?.getTime() || 0) > (existing.lastActivity?.toDate()?.getTime() || 0)) {
                    map.set(session.sessionId, session);
                }
                return map;
            }, new Map())
            .values()
    );

    return {
        activeVisitors: liveSessions.length,
        recentEvents,
        todayStats,
        liveSessions
    };
};

export const useAnalyticsData = (timeRange: string = '7d') => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        setLoading(false);
    }, [timeRange]);

    return {
        loading,
        data,
    };
};
