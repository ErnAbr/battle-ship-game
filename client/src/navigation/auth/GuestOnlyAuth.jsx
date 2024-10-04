import { useEffect } from "react";
import { useAppStore } from "../../context/store.js";
import { toast } from "react-toastify";
import { routes } from "../routes/routes.js";
import { Navigate, Outlet } from "react-router-dom";

export const GuestOnlyAuth = () => {
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (user) {
      toast.error("You Are Already Logged In");
    }
  }, [user]);

  return user ? <Navigate to={routes.HOME} /> : <Outlet />;
};
