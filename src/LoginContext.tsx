import { createContext, useContext, useState, useEffect } from "react";
import { CurrentUser, LoginContextType } from "./types";
import { googleLogout } from "./firebase";

const LoginContext = createContext<LoginContextType>({} as LoginContextType);

export function useLogin() {
  return useContext(LoginContext);
}

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(
    (localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") || "")) ||
      null
  );
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(
    localStorage.getItem("isLoggedIn?")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    currentUser && localStorage.setItem("propic", currentUser.user.photoURL);
  }, [currentUser]);

  const logout = () => {
    googleLogout();
    localStorage.clear();
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    setIsLoading,
    logout,
    currentPage,
    setCurrentPage,
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}
