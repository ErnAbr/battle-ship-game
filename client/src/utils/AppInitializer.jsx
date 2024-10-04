import { useEffect } from "react";
import { useAppStore } from "../context/store.js";
import { toast } from "react-toastify";

export const AppInitializer = ({ children }) => {
  const initializeUser = useAppStore((state) => state.initializeUser);

  useEffect(() => {
    try {
      initializeUser();
    } catch {
      toast.error("Failed to Load the User");
    }
  }, [initializeUser]);

  return <>{children}</>;
};
