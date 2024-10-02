import { Outlet } from "react-router-dom";
import { TopAppBar } from "../../components/AppBar/TopAppBar.jsx";

export function MainLayout() {
  return (
    <>
      <TopAppBar />
      <Outlet />
    </>
  );
}
