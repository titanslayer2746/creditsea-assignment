import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  user: { email: string; role: "user" | "verifier" | "admin" } | null;
  login: (credentials: { email: string; password: string; role: "user" | "verifier" | "admin" }) => Promise<void>;
  signUp: (data: { fullName: string; email: string; password: string; role: "user" | "verifier" | "admin" }) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; role: "user" | "verifier" | "admin" } | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  

  // ✅ Automatically fetch user session on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (error) {
        console.error("Session expired or not authenticated", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    fetchUser();
  }, []);
  

  // ✅ Login Function
  const login = async ({ email, password, role }: { email: string; password: string; role: string }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password, role },
        { withCredentials: true }  // ✅ Make sure cookies are sent
      );
      
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ Sign-Up Function
  const signUp = async ({ fullName, email, password, role }: { fullName: string; email: string; password: string; role: string }) => {
    try {
      await axios.post("http://localhost:3000/api/auth/signup", { fullName, email, password, role });
      await login({ email, password, role }); // Auto-login after signup
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user"); // Remove user from storage
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return <AuthContext.Provider value={{ user, login, signUp, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
