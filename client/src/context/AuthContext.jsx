import {createContext,useContext,useEffect,useState,} from "react";

import api from "../api/axios";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/auth/profile");

        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getProfile();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(response.data.user);

    return response.data.user;
  };

const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    setUser(null);
  }
};

  return (
    <AuthContext.Provider
      value={{ user, authLoading,
        login,logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };