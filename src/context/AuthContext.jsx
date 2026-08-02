import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        localStorage.setItem("token", token);
        try {
          const res = await api.get("/users/profile");
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          // If token is invalid/expired
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };
    
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/authenticate", { email, password });
    setToken(res.data.token);
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await api.post("/auth/register", { firstName, lastName, email, password });
    setToken(res.data.token);
  };

  const logout = () => {
    setToken(null);
  };

  const value = { user, token, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
