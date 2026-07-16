"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import { X } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { v4 as uuidv4 } from "uuid";

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
  priority?: "low" | "medium" | "high";
  type?: "info" | "success" | "warning" | "error";
  fadingOut?: boolean;
}

export interface AnimatedNotificationProps {
  maxNotifications?: number;
  autoInterval?: number;
  autoGenerate?: boolean;
  notifications?: NotificationItem[];
  customMessages?: string[];
  animationDuration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  width?: number;
  showAvatars?: boolean;
  showTimestamps?: boolean;
  className?: string;
  onNotificationClick?: (notification: NotificationItem) => void;
  onNotificationDismiss?: (notification: NotificationItem) => void;
  allowDismiss?: boolean;
  autoDismissTimeout?: number;
  userApiEndpoint?: string;
  variant?: "default" | "minimal" | "glass" | "bordered";
  fixedUser?: NotificationUser;
}

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
  "Backup completed 🛡️",
];

const Avatar: React.FC<{ user: NotificationUser; showAvatar: boolean }> = ({ user, showAvatar }) => {
  if (!showAvatar) return null;
  return (
    <div
      className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
      style={{ backgroundColor: user.color }}
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={`${user.name} avatar`} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span className="text-xs font-bold text-white drop-shadow-sm">
          {user.initials || user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
};

const Notification: React.FC<{
  notification: NotificationItem;
  showAvatars: boolean;
  showTimestamps: boolean;
  variant: string;
  onDismiss?: () => void;
  onClick?: () => void;
  allowDismiss: boolean;
}> = ({ notification, showAvatars, showTimestamps, variant, onDismiss, onClick, allowDismiss }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "minimal":
        return "bg-background/95 border border-border/50 backdrop-blur-xl";
      case "glass":
        return "bg-background/30 backdrop-blur-2xl border border-white/20 dark:border-gray-800/20 shadow-2xl";
      case "bordered":
        return "bg-card/95 border-2 border-primary/30 backdrop-blur-lg shadow-xl";
      default:
        return "bg-background/30 backdrop-blur-2xl border border-white/20 shadow-2xl";
    }
  };

  const getPriorityStyles = () => {
    switch (notification.priority) {
      case "high":
        return "border-l-4 border-l-red-500 shadow-red-500/20 dark:border-l-red-500 dark:shadow-red-500/20";
      case "medium":
        return "border-l-4 border-l-yellow-500 shadow-yellow-500/20 dark:border-l-yellow-500 dark:shadow-yellow-500/20";
      case "low":
        return "border-l-4 border-l-blue-500 shadow-[0_4px_15px_color-mix(in_srgb,var(--primarylw)_20%,transparent)] dark:border-l-blue-500 dark:shadow-[0_4px_15px_color-mix(in_srgb,var(--primarylw)_20%,transparent)]";
      default:
        return "border-l-4 border-l-primary/50 shadow-primary/20 dark:border-l-primary/50 dark:shadow-primary/20";
    }
  };

  return (
    <div
      className={cn(
        "group relative transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1",
        "rounded-xl p-4 flex items-start gap-3 w-80 max-w-80 cursor-pointer",
        getVariantStyles(),
        getPriorityStyles(),
        notification.fadingOut && "animate-pulse"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      <Avatar user={notification.user} showAvatar={showAvatars} />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground/90 truncate">{notification.user.name}</h3>
          {showTimestamps && notification.timestamp && <span className="text-xs text-muted-foreground/70 font-mono">{notification.timestamp}</span>}
        </div>
        <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{notification.message}</p>
      </div>

      {allowDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className="flex-shrink-0 w-5 h-5 text-muted-foreground/50 hover:text-muted-foreground transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
          aria-label="dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

async function fetchRandomUser(apiEndpoint?: string): Promise<NotificationUser> {
  try {
    const endpoint = apiEndpoint || "https://randomuser.me/api/";
    const res = await fetch(endpoint);
    const data = await res.json();
    const user = data.results[0];
    return {
      avatarUrl: user.picture?.large,
      name: `${user.name.first} ${user.name.last}`,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`,
    };
  } catch (error) {
    const names = ["John Doe", "Jane Smith", "Alex Johnson", "Sarah Wilson", "Mike Brown"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    return {
      name: randomName,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`,
    };
  }
}

function getRandomMessage(customMessages?: string[]) {
  const messages = customMessages || defaultMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

async function generateNotification(customMessages?: string[], userApiEndpoint?: string, fixedUser?: NotificationUser): Promise<NotificationItem> {
  const user = fixedUser || await fetchRandomUser(userApiEndpoint);
  return {
    id: uuidv4(),
    user,
    message: getRandomMessage(customMessages),
    timestamp: new Date().toLocaleTimeString(),
    priority: (["low", "medium", "high"] as const)[Math.floor(Math.random() * 3)],
  };
}

const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  maxNotifications = 3,
  autoInterval = 3500,
  autoGenerate = true,
  notifications = [],
  customMessages,
  animationDuration = 800,
  position = "center",
  width = 320,
  showAvatars = true,
  showTimestamps = true,
  className,
  onNotificationClick,
  onNotificationDismiss,
  allowDismiss = true,
  autoDismissTimeout = 3000,
  userApiEndpoint,
  variant = "glass",
  fixedUser,
}) => {
  const [notes, setNotes] = useState<NotificationItem[]>(notifications);
  const intervalRef = useRef<number | null>(null);
  const dismissTimeouts = useRef<Map<string, number>>(new Map());
  const isGenerating = useRef(false);

  // Helper: Clear a per-note timeout
  const clearNoteTimeout = useCallback((id: string) => {
    const t = dismissTimeouts.current.get(id);
    if (t) {
      window.clearTimeout(t);
      dismissTimeouts.current.delete(id);
    }
  }, []);

  // Dismiss with fade + removal after animationDuration
  const dismissNotification = useCallback(
    (id: string, isAutoRemoval = false) => {
      setNotes((prev) => {
        const note = prev.find((n) => n.id === id);
        if (!note || note.fadingOut) return prev;

        // mark fading out
        const updated = prev.map((n) => (n.id === id ? { ...n, fadingOut: true } : n));
        // clear any auto timeout
        clearNoteTimeout(id);

        // remove after animation
        window.setTimeout(() => {
          setNotes((current) => {
            const remaining = current.filter((n) => n.id !== id);
            // only call onNotificationDismiss if the note actually existed before removal
            if (note && onNotificationDismiss) {
              // isAutoRemoval true indicates it was auto-dismissed; user can still be notified if needed
              onNotificationDismiss(note);
            }
            return remaining;
          });
        }, animationDuration);

        return updated;
      });
    },
    [animationDuration, clearNoteTimeout, onNotificationDismiss]
  );

  // Add a new note (from generator). Ensures we don't create concurrency issues.
  const addGeneratedNote = useCallback(async () => {
    if (!autoGenerate) return;
    if (isGenerating.current) return;
    isGenerating.current = true;
    try {
      const newNote = await generateNotification(customMessages, userApiEndpoint, fixedUser);

      setNotes((prev) => {
        // prune: if there are >= maxNotifications non-fading notes, dismiss the oldest non-fading
        const nonFading = prev.filter((n) => !n.fadingOut);
        if (nonFading.length >= maxNotifications) {
          const oldest = nonFading[0];
          // gracefully mark it for fading and schedule removal using existing dismissNotification
          // call dismissNotification (which will clear its timeout and run onNotificationDismiss)
          // but to avoid calling setNotes nested while in this setNotes, we will mark it locally:
          const locallyUpdated = prev.map((n) => (n.id === oldest.id ? { ...n, fadingOut: true } : n));
          // schedule actual removal outside this setNotes by using setTimeout
          window.setTimeout(() => {
            setNotes((current) => current.filter((n) => n.id !== oldest.id));
            clearNoteTimeout(oldest.id);
            onNotificationDismiss?.(oldest);
          }, animationDuration);
          // Also clear any auto timeout for that oldest note
          const t = dismissTimeouts.current.get(oldest.id);
          if (t) {
            window.clearTimeout(t);
            dismissTimeouts.current.delete(oldest.id);
          }
          // then append the new note
          const appended = [...locallyUpdated, newNote];
          // schedule auto-dismiss for newNote
          if (autoDismissTimeout > 0) {
            const timeoutId = window.setTimeout(() => dismissNotification(newNote.id, true), autoDismissTimeout);
            dismissTimeouts.current.set(newNote.id, timeoutId);
          }
          return appended;
        } else {
          const appended = [...prev, newNote];
          if (autoDismissTimeout > 0) {
            const timeoutId = window.setTimeout(() => dismissNotification(newNote.id, true), autoDismissTimeout);
            dismissTimeouts.current.set(newNote.id, timeoutId);
          }
          return appended;
        }
      });
    } finally {
      isGenerating.current = false;
    }
  }, [
    autoGenerate,
    customMessages,
    userApiEndpoint,
    maxNotifications,
    animationDuration,
    autoDismissTimeout,
    dismissNotification,
    onNotificationDismiss,
    clearNoteTimeout,
    fixedUser,
  ]);

  // Start/stop the interval generator
  useEffect(() => {
    // If autoGenerate enabled, start interval. We'll call addGeneratedNote every autoInterval.
    if (autoGenerate) {
      // start with a small delay so UI can mount
      intervalRef.current = window.setInterval(() => {
        void addGeneratedNote();
      }, autoInterval);

      // do a first immediate call after small delay (not instant) so initial experience is consistent
      const first = window.setTimeout(() => void addGeneratedNote(), 900);

      return () => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        window.clearTimeout(first);
      };
    } else {
      // autoGenerate disabled -> ensure no interval running
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate, autoInterval, addGeneratedNote]);

  // Sync external notifications prop if the parent supplies them
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // clear existing timers
      dismissTimeouts.current.forEach((t) => window.clearTimeout(t));
      dismissTimeouts.current.clear();
      setNotes(notifications);
      // set up auto dismiss for those if needed
      if (autoDismissTimeout > 0) {
        notifications.forEach((n) => {
          const id = window.setTimeout(() => dismissNotification(n.id, true), autoDismissTimeout);
          dismissTimeouts.current.set(n.id, id);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  // cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      dismissTimeouts.current.forEach((t) => window.clearTimeout(t));
      dismissTimeouts.current.clear();
    };
  }, []);

  // Manual dismiss wrapper so the caller's onNotificationDismiss isn't called twice
  const handleManualDismiss = useCallback(
    (note: NotificationItem) => {
      // clear timeout and fade out
      clearNoteTimeout(note.id);
      // mark fading and remove after animationDuration
      setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, fadingOut: true } : n)));
      window.setTimeout(() => {
        setNotes((current) => {
          const filtered = current.filter((n) => n.id !== note.id);
          onNotificationDismiss?.(note);
          return filtered;
        });
      }, animationDuration);
    },
    [animationDuration, clearNoteTimeout, onNotificationDismiss]
  );

  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return "fixed top-6 left-6 z-50";
      case "top-right":
        return "fixed top-6 right-6 z-50";
      case "bottom-left":
        return "fixed bottom-6 left-6 z-50";
      case "bottom-right":
        return "fixed bottom-6 right-6 z-50";
      default:
        return "flex items-center justify-center min-h-auto p-6";
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
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
        `,
        }}
      />

      <div className={cn(getPositionStyles(), className)}>
        <Flipper flipKey={notes.map((n) => n.id).join("")}>
          <div className="flex flex-col gap-4 items-center" style={{ width }}>
            {notes.map((note) => (
              <Flipped key={note.id} flipId={note.id}>
                <div
                  className={cn("notification-item", note.fadingOut ? "notification-exit" : "notification-enter")}
                  style={{ ["--animation-duration" as any]: `${animationDuration}ms` } as React.CSSProperties}
                >
                  <Notification
                    notification={note}
                    showAvatars={showAvatars}
                    showTimestamps={showTimestamps}
                    variant={variant}
                    allowDismiss={allowDismiss}
                    onClick={() => onNotificationClick?.(note)}
                    onDismiss={() => handleManualDismiss(note)}
                  />
                </div>
              </Flipped>
            ))}
          </div>
        </Flipper>
      </div>
    </>
  );
};

export default AnimatedNotification;
