import React from 'react';
export interface NotificationUser {
    avatarUrl?: string;
    name: string;
    initials?: string;
    color?: string;
}
export interface NotificationItem {
    id: string;
    user: NotificationUser;
    message: string;
    timestamp?: string;
    priority?: 'low' | 'medium' | 'high';
    type?: 'info' | 'success' | 'warning' | 'error';
    fadingOut?: boolean;
}
export interface AnimatedNotificationProps {
    /** Maximum number of notifications to show at once */
    maxNotifications?: number;
    /** Interval between auto-generated notifications (in ms) */
    autoInterval?: number;
    /** Enable auto-generation of notifications */
    autoGenerate?: boolean;
    /** Custom notification data */
    notifications?: NotificationItem[];
    /** Custom messages for auto-generation */
    customMessages?: string[];
    /** Animation duration for fade transitions */
    animationDuration?: number;
    /** Position of the notification center */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    /** Width of notification cards */
    width?: number;
    /** Enable/disable user avatars */
    showAvatars?: boolean;
    /** Enable/disable timestamps */
    showTimestamps?: boolean;
    /** Custom CSS class */
    className?: string;
    /** Callback when notification is clicked */
    onNotificationClick?: (notification: NotificationItem) => void;
    /** Callback when notification is dismissed */
    onNotificationDismiss?: (notification: NotificationItem) => void;
    /** Enable manual dismiss */
    allowDismiss?: boolean;
    /** Auto dismiss timeout (0 to disable) */
    autoDismissTimeout?: number;
    /** Custom API endpoint for fetching users */
    userApiEndpoint?: string;
    /** Theme variant */
    variant?: 'default' | 'minimal' | 'glass' | 'bordered';
}
declare const AnimatedNotification: React.FC<AnimatedNotificationProps>;
export default AnimatedNotification;
