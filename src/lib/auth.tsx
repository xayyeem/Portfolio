// import { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import { supabase } from './supabase';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session);
//       setLoading(false);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       (async () => {
//         setSession(session);
//         setLoading(false);
//       })();
//     });

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   const signIn = useCallback(async (email, password) => {
//     return supabase.auth.signInWithPassword({ email, password });
//   }, []);

//   const signOut = useCallback(async () => {
//     return supabase.auth.signOut();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("admin");

    if (token && admin) {
      setSession({
        token,
        admin: JSON.parse(admin),
      });
    }
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || "Invalid credentials",
        };
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      setSession({
        token: data.token,
        admin: data.admin,
      });

      return { error: null };
    } catch (error) {
      console.error("Login error:", error);

      return {
        error: "Unable to connect to server",
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);