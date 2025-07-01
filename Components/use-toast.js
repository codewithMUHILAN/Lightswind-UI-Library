import * as React from "react";
// Action types for reducer
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
};
// Configuration constants
const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;
// ID generation for toasts
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}
// Track toast timeouts
const toastTimeouts = new Map();
// Reducer for toast state management
const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };
        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t),
            };
        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action;
            if (toastId === undefined) {
                return {
                    ...state,
                    toasts: state.toasts.map((t) => ({
                        ...t,
                        open: false,
                    })),
                };
            }
            return {
                ...state,
                toasts: state.toasts.map((t) => t.id === toastId ? { ...t, open: false } : t),
            };
        }
        case actionTypes.REMOVE_TOAST: {
            const { toastId } = action;
            if (toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== toastId),
            };
        }
    }
};
// Memory state and listeners
const listeners = [];
let memoryState = { toasts: [] };
// Dispatch function to update state and notify listeners
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}
function toast(props) {
    const id = genId();
    // Auto-dismiss after duration
    if (props.duration !== Infinity) {
        const timeout = setTimeout(() => {
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
            // Remove after animation completes
            setTimeout(() => {
                dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
            }, TOAST_REMOVE_DELAY);
            toastTimeouts.delete(id);
        }, props.duration || 5000);
        toastTimeouts.set(id, timeout);
    }
    // Methods for the toast
    const update = (props) => {
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
        });
        return id;
    };
    const dismiss = () => {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
        // Clear any existing timeout
        const timeout = toastTimeouts.get(id);
        if (timeout) {
            clearTimeout(timeout);
            toastTimeouts.delete(id);
        }
        // Remove after animation completes
        setTimeout(() => {
            dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
        }, TOAST_REMOVE_DELAY);
    };
    // Add the toast to state
    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open)
                    dismiss();
                props.onOpenChange?.(open);
            },
        },
    });
    return {
        id,
        dismiss,
        update,
    };
}
// Convenience functions for different toast types
toast.default = (props) => toast({ ...props, type: "default" });
toast.destructive = (props) => toast({ ...props, type: "destructive" });
toast.success = (props) => toast({ ...props, type: "success", variant: "success" });
toast.warning = (props) => toast({ ...props, type: "warning" });
toast.info = (props) => toast({ ...props, type: "info" });
// Hook for consuming toasts
function useToast() {
    const [state, setState] = React.useState(memoryState);
    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);
    return {
        ...state,
        toast,
        dismiss: (toastId) => {
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
            if (toastId) {
                const timeout = toastTimeouts.get(toastId);
                if (timeout) {
                    clearTimeout(timeout);
                    toastTimeouts.delete(toastId);
                }
                setTimeout(() => {
                    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
                }, TOAST_REMOVE_DELAY);
            }
        },
    };
}
export { useToast, toast };
