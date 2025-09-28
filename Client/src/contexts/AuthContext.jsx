// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Adjust this import path if needed

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap your app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // Store the current Firebase user
  const [isAdmin, setIsAdmin] = useState(false); // Store admin status
  const [loading, setLoading] = useState(true);  // Loading state to know when auth state is being checked

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Dummy admin check — replace with your own logic (e.g. roles in DB)
        const adminEmails = ["nitikasingh262@gmail.com"];
        setIsAdmin(adminEmails.includes(firebaseUser.email));
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);  // Auth check finished
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Optionally, you can provide a way to refresh user or sign out here if needed

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
