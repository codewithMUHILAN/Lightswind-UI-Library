"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
const defaultMessages = [
    "Just completed a task! ✅",
    "New feature deployed 🚀",
    "Check out our latest update 📱",
    "Server responded with 200 OK ✨",
    "Background job finished 🔄",
    "Data synced successfully! 💾",
    "User logged in successfully 👋",
    "Payment processed 💳",
    "Email sent successfully 📧",
    "Backup completed 🛡️"
];
const Avatar = ({ user, showAvatar }) => {
    if (!showAvatar)
        return null;
    return (_jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full \r\n      overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 \r\n      flex items-center justify-center transition-all duration-300 \r\n      hover:scale-110 backdrop-blur-sm", style: { backgroundColor: user.color }, children: user.avatarUrl ? (_jsx("img", { src: user.avatarUrl, alt: `${user.name} avatar`, className: "w-full h-full object-cover", loading: "lazy" })) : (_jsx("span", { className: "text-xs font-bold text-white drop-shadow-sm", children: user.initials || user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() })) }));
};
const Notification = ({ notification, showAvatars, showTimestamps, variant, onDismiss, onClick, allowDismiss }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'minimal':
                return "bg-background/95 border border-border/50 backdrop-blur-xl";
            case 'glass':
                return "bg-background/30 backdrop-blur-2xl border border-white/20 dark:border-gray-800/20 shadow-2xl";
            case 'bordered':
                return "bg-card/95 border-2 border-primary/30 backdrop-blur-lg shadow-xl";
            default:
                return "bg-background/30 backdrop-blur-2xl border border-white/20 shadow-2xl";
        }
    };
    const getPriorityStyles = () => {
        switch (notification.priority) {
            case 'high':
                return 'border-l-4 border-l-red-500 shadow-red-500/20 dark:border-l-red-500 dark:shadow-red-500/20';
            case 'medium':
                return 'border-l-4 border-l-yellow-500 shadow-yellow-500/20 dark:border-l-yellow-500 dark:shadow-yellow-500/20';
            case 'low':
                return 'border-l-4 border-l-blue-500 shadow-blue-500/20 dark:border-l-blue-500 dark:shadow-blue-500/20';
            default:
                return 'border-l-4 border-l-primary/50 shadow-primary/20 dark:border-l-primary/50 dark:shadow-primary/20';
        }
    };
    return (_jsxs("div", { className: cn("group relative transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1", "rounded-xl p-4 flex items-start gap-3 w-80 max-w-80 cursor-pointer", getVariantStyles(), getPriorityStyles(), notification.fadingOut && "animate-pulse"), onClick: onClick, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" }), _jsx(Avatar, { user: notification.user, showAvatar: showAvatars }), _jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-sm text-foreground/90 truncate", children: notification.user.name }), showTimestamps && notification.timestamp && (_jsx("span", { className: "text-xs text-muted-foreground/70 font-mono", children: notification.timestamp }))] }), _jsx("p", { className: "text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed", children: notification.message })] }), allowDismiss && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onDismiss?.();
                }, className: "flex-shrink-0 w-5 h-5 text-muted-foreground/50 hover:text-muted-foreground transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100", children: _jsx(X, { className: "w-4 h-4" }) }))] }));
};
async function fetchRandomUser(apiEndpoint) {
    try {
        const endpoint = apiEndpoint || "https://randomuser.me/api/";
        const res = await fetch(endpoint);
        const data = await res.json();
        const user = data.results[0];
        return {
            avatarUrl: user.picture?.large,
            name: `${user.name.first} ${user.name.last}`,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`
        };
    }
    catch (error) {
        const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Wilson', 'Mike Brown'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        return {
            name: randomName,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`
        };
    }
}
function getRandomMessage(customMessages) {
    const messages = customMessages || defaultMessages;
    return messages[Math.floor(Math.random() * messages.length)];
}
async function generateNotification(customMessages, userApiEndpoint) {
    const user = await fetchRandomUser(userApiEndpoint);
    return {
        id: crypto.randomUUID(),
        user,
        message: getRandomMessage(customMessages),
        timestamp: new Date().toLocaleTimeString(),
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    };
}
const AnimatedNotification = ({ maxNotifications = 3, autoInterval = 1500, autoGenerate = true, notifications = [], customMessages, animationDuration = 800, position = 'center', width = 320, showAvatars = true, showTimestamps = true, className, onNotificationClick, onNotificationDismiss, allowDismiss = true, autoDismissTimeout = 0, userApiEndpoint, variant = 'glass' }) => {
    const [notes, setNotes] = useState(notifications);
    const timeoutRef = useRef(null);
    const dismissTimeouts = useRef(new Map());
    const dismissNotification = useCallback((id) => {
        setNotes(prev => {
            const noteToDismiss = prev.find(note => note.id === id);
            if (!noteToDismiss || noteToDismiss.fadingOut) {
                return prev;
            }
            const updatedNotes = prev.map(note => note.id === id ? { ...note, fadingOut: true } : note);
            const timeout = dismissTimeouts.current.get(id);
            if (timeout) {
                clearTimeout(timeout);
                dismissTimeouts.current.delete(id);
            }
            setTimeout(() => {
                setNotes(current => current.filter(note => note.id !== id));
            }, animationDuration);
            return updatedNotes;
        });
    }, [animationDuration]);
    const addNote = useCallback(async () => {
        if (!autoGenerate)
            return;
        const newNote = await generateNotification(customMessages, userApiEndpoint);
        setNotes((prev) => {
            let currentNotes = [...prev];
            if (currentNotes.length >= maxNotifications) {
                const oldestNote = currentNotes[0];
                if (oldestNote && !oldestNote.fadingOut) {
                    currentNotes = currentNotes.map((note, i) => i === 0 ? { ...note, fadingOut: true } : note);
                    setTimeout(() => {
                        setNotes(current => current.filter(note => note.id !== oldestNote.id));
                    }, animationDuration);
                }
            }
            return [...currentNotes, newNote];
        });
        if (autoDismissTimeout > 0) {
            const timeout = setTimeout(() => {
                dismissNotification(newNote.id);
            }, autoDismissTimeout);
            dismissTimeouts.current.set(newNote.id, timeout);
        }
        if (autoGenerate) {
            timeoutRef.current = setTimeout(addNote, autoInterval);
        }
    }, [
        autoGenerate,
        customMessages,
        userApiEndpoint,
        maxNotifications,
        autoInterval,
        autoDismissTimeout,
        animationDuration,
        dismissNotification
    ]);
    useEffect(() => {
        if (autoGenerate) {
            timeoutRef.current = setTimeout(addNote, 1000);
        }
        return () => {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
            dismissTimeouts.current.forEach(timeout => clearTimeout(timeout));
            dismissTimeouts.current.clear();
        };
    }, [addNote, autoGenerate]);
    useEffect(() => {
        if (notifications.length > 0 && JSON.stringify(notes) !== JSON.stringify(notifications)) {
            setNotes(notifications);
            dismissTimeouts.current.forEach(timeout => clearTimeout(timeout));
            dismissTimeouts.current.clear();
        }
    }, [notifications, notes]);
    const getPositionStyles = () => {
        switch (position) {
            case 'top-left':
                return 'fixed top-6 left-6 z-50';
            case 'top-right':
                return 'fixed top-6 right-6 z-50';
            case 'bottom-left':
                return 'fixed bottom-6 left-6 z-50';
            case 'bottom-right':
                return 'fixed bottom-6 right-6 z-50';
            default:
                return 'flex items-center justify-center min-h-auto p-6';
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { dangerouslySetInnerHTML: {
                    __html: `
          @keyframes notification-enter {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
              filter: blur(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0px);
            }
          }

          @keyframes notification-exit {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0px);
            }
            to {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
              filter: blur(4px);
            }
          }

          .notification-enter {
            animation: notification-enter var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .notification-exit {
            animation: notification-exit var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `
                } }), _jsx("div", { className: cn(getPositionStyles(), className), children: _jsx(Flipper, { flipKey: notes.map((note) => note.id).join(""), children: _jsx("div", { className: "flex flex-col gap-4 items-center", style: { width }, children: notes.map((note) => (_jsx(Flipped, { flipId: note.id, children: _jsx("div", { className: cn("notification-item", note.fadingOut ? "notification-exit" : "notification-enter"), style: { '--animation-duration': `${animationDuration}ms` }, children: _jsx(Notification, { notification: note, showAvatars: showAvatars, showTimestamps: showTimestamps, variant: variant, allowDismiss: allowDismiss, onClick: () => onNotificationClick?.(note), onDismiss: () => {
                                        onNotificationDismiss?.(note);
                                        dismissNotification(note.id);
                                    } }) }) }, note.id))) }) }) })] }));
};
export default AnimatedNotification;
