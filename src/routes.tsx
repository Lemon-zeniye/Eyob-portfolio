import { createBrowserRouter } from "react-router-dom";

import Login from "./Pages/Authentication/Login";
import Signup from "./Pages/Authentication/Signup";
import AppLayout from "./Pages/AppLayout";
import PrivateRoute from "./Context/PrivateRoute";
import { NotFoundPage } from "./Pages/NotFoundPage";
import { UnauthorizedPage } from "./Pages/UnauthorizedPage";
import { ErrorPage } from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import ScanQRCode from "./Pages/ScanQRCode";
import GeneratQRCode from "./Pages/GeneratQRCode";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/scan",
    element: <ScanQRCode />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/generate",
    element: <GeneratQRCode />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PrivateRoute allowedRoles={["user", "company"]} />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      // {
      //   element: <PrivateRoute allowedRoles={["user"]} />,
      //   errorElement: <ErrorPage />,
      //   children: [
      //     {
      //       path: "jobs/applied-jobs",
      //       element: <AppliedJobs />,
      //       errorElement: <ErrorPage />,
      //     },
      //   ],
      // },
      // {
      //   element: <PrivateRoute allowedRoles={["company"]} />,
      //   errorElement: <ErrorPage />,
      //   children: [
      //     {
      //       path: "jobs/add-job",
      //       element: <AddJob />,
      //       errorElement: <ErrorPage />,
      //     },
      //   ],
      // },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
]);
