import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useUserQuery } from "../services/queries";
import { setUser, clearUser, setLoading } from "../store/slices/authSlice";
import type { RootState } from "../store";
// Define types for our context
interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const loginMutation = useLoginMutation();

  // Auto-fetch user data if token exists
  useUserQuery({
    onSuccess: (data) => {
      dispatch(setUser(data));
    },
    onError: () => {
      dispatch(clearUser());
    },
    // Only run if we have a token
    enabled: !!localStorage.getItem("token"),
  });

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const { token, user } = await loginMutation.mutateAsync({
        email,
        password,
      });
      localStorage.setItem("token", token);
      dispatch(setUser(user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook that combines context and redux state
export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    ...context,
    user,
    isAuthenticated,
    loading,
  };
};
