
import { toast as sonnerToast } from "sonner";
import { useToast } from "../hooks/use-toast";
import React from "react";

/**
 * Converts the shadcn/ui useToast hook to a simpler API similar to sonner.
 * 
 * This provides a consistent API for both toast systems.
 */
export const convertShadcnToast = () => {
  const { toast: shadcnToast } = useToast();
  
  type ToastActionElement = React.ReactElement<HTMLButtonElement>;
  
  type ToastOptions = {
    title?: string;
    description?: string;
    action?: ToastActionElement;
    duration?: number;
  };
  
  const toast = (messageOrOptions: string | ToastOptions) => {
    if (typeof messageOrOptions === "string") {
      return shadcnToast({
        title: messageOrOptions,
      });
    }
    
    return shadcnToast({
      title: messageOrOptions.title || "",
      description: messageOrOptions.description,
      action: messageOrOptions.action,
      duration: messageOrOptions.duration,
    });
  };
  
  toast.success = (messageOrOptions: string | ToastOptions) => {
    if (typeof messageOrOptions === "string") {
      return shadcnToast({
        title: messageOrOptions,
        variant: "success",
      });
    }
    
    return shadcnToast({
      title: messageOrOptions.title || "",
      description: messageOrOptions.description,
      action: messageOrOptions.action,
      duration: messageOrOptions.duration,
      variant: "success",
    });
  };
  
  toast.error = (messageOrOptions: string | ToastOptions) => {
    if (typeof messageOrOptions === "string") {
      return shadcnToast({
        title: messageOrOptions,
        variant: "destructive",
      });
    }
    
    return shadcnToast({
      title: messageOrOptions.title || "",
      description: messageOrOptions.description,
      action: messageOrOptions.action,
      duration: messageOrOptions.duration,
      variant: "destructive",
    });
  };
  
  toast.warning = (messageOrOptions: string | ToastOptions) => {
    if (typeof messageOrOptions === "string") {
      return shadcnToast({
        title: messageOrOptions,
        variant: "warning",
      });
    }
    
    return shadcnToast({
      title: messageOrOptions.title || "",
      description: messageOrOptions.description,
      action: messageOrOptions.action,
      duration: messageOrOptions.duration,
      variant: "warning",
    });
  };
  
  toast.info = (messageOrOptions: string | ToastOptions) => {
    if (typeof messageOrOptions === "string") {
      return shadcnToast({
        title: messageOrOptions,
        variant: "info",
      });
    }
    
    return shadcnToast({
      title: messageOrOptions.title || "",
      description: messageOrOptions.description,
      action: messageOrOptions.action,
      duration: messageOrOptions.duration,
      variant: "info",
    });
  };
  
  return toast;
};

/**
 * Use sonner toast for a simpler API
 */
export const useSonnerToast = () => {
  return sonnerToast;
};
