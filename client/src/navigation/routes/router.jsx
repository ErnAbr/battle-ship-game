import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { NotFoundPage } from "../../pages/NotFoundPage/NotFoundPage.jsx";
import { Homepage } from "../../pages/Homepage/Homepage.jsx";
import { Statspage } from "../../pages/Statspage/Statspage.jsx";
import { MainLayout } from "../layout/MainLayout.jsx";
import { routes } from "./routes.js";
import { Loginpage } from "../../pages/Loginpage/Loginpage.jsx";
import { GuestOnlyAuth } from "../auth/GuestOnlyAuth.jsx";
import { RequireAuth } from "../auth/RequireAuth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: routes.HOME,
        element: <Homepage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: routes.STATS,
            element: <Statspage />,
          },
        ],
      },
      {
        element: <GuestOnlyAuth />,
        children: [{ path: routes.LOGIN, element: <Loginpage /> }],
      },
      { path: "/not-found", element: <NotFoundPage /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
