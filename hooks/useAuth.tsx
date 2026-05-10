"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/config";
import { syncLogoutToOtherSite } from "../lib/sso";

interface FormattedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

interface UserContextType {
  user: FormattedUser | null;
  setUser: Dispatch<SetStateAction<FormattedUser | null>>;
  userPlan: "basic" | "pro" | "premium" | "team" | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: (force?: boolean) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FormattedUser | null>(null);
  const [userPlan, setUserPlan] = useState<"basic" | "pro" | "premium" | "team" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserPlan = async (currentUser: User) => {
    try {
      const userEmail = currentUser.email?.toLowerCase() || "";
      const paymentsRef = collection(db, "lightswind-payments");
      const q = query(paymentsRef, where("userEmail", "==", userEmail));
      const querySnapshot = await getDocs(q);
      const paymentDocs = querySnapshot.docs.map((doc) => doc.data());

      let plan: "basic" | "pro" | "premium" | "team" = "basic";

      const primaryPayment = paymentDocs.find((data: any) => {
        const status = data.paymentStatus?.toLowerCase();
        return status === "success";
      });

      if (primaryPayment) {
        const pName = primaryPayment.planName?.toLowerCase() || "";
        if (pName.includes("team")) plan = "team";
        else if (pName.includes("premium")) plan = "premium";
        else plan = "pro";
      }

      // Check if user is a member of any team (Inherited Pro status)
      const docRef = doc(db, "lightswind-users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isTeamMember && plan === "basic") {
           plan = "pro"; // Members get Pro access
        }
      }

      setUserPlan(plan);
    } catch (error) {
      console.error("Error fetching payment status:", error);
      setUserPlan("basic");
    }
  };

  const refreshUser = async (force: boolean = false) => {
    if (auth.currentUser) {
      await fetchUserPlan(auth.currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (currentUser) {
        const formattedUser: FormattedUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          phoneNumber: currentUser.phoneNumber,
        };
        setUser(formattedUser);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("lightswind_user_data", JSON.stringify(formattedUser));

        // ── Relay auth token to Lightswind AI Extension (if installed) ──
        try {
          const idToken = await currentUser.getIdToken();
          if (typeof window !== 'undefined' && (window as any).chrome?.runtime?.sendMessage) {
            (window as any).chrome.runtime.sendMessage(
              undefined, 
              { action: 'lightswind_auth_token', idToken, user: formattedUser },
            );
          }
        } catch (_) {}

        await fetchUserPlan(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setUserPlan("basic");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      syncLogoutToOtherSite().catch(() => {});
      await firebaseSignOut(auth);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("lightswind_user_data");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, userPlan, loading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
