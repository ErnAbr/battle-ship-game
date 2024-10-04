import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../routes/routes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppStore } from "../../context/store.js";

export const RequireAuth = () => {
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to view this page.");
    }
  }, [user]);

  return user ? <Outlet /> : <Navigate to={routes.LOGIN} />;
};
