import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "./services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiRequest("auth/me", "GET");
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await apiRequest("auth/logout", "POST");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
