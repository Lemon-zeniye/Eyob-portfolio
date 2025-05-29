import { createBrowserRouter } from "react-router-dom";

import Login from "./Pages/Authentication/Login";
import Signup from "./Pages/Authentication/Signup";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import Chat from "./Pages/Chat";
import CreateProfile from "./Pages/CreateProfile";
import AppliedJobs from "./Pages/AppliedJobs";
import AddJob from "./components/Jobs/AddJob";
import JobPage from "./Pages/JobPage";
import AppLayout from "./Pages/AppLayout";
import PrivateRoute from "./Context/PrivateRoute";
import { SocketProvider } from "./Context/SocketProvider";
import JobDetailContainer from "./components/Jobs/JobDetailContainer";
import HomePage from "./Pages/HomePage";
import Notifications from "./Pages/Notifications";
import UserProfilePage from "./Pages/UserProfilePage";
import Explore from "./Pages/Explore";
import { NotFoundPage } from "./Pages/NotFoundPage";
import { UnauthorizedPage } from "./Pages/UnauthorizedPage";
import { ErrorPage } from "./Pages/ErrorPage";

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
    path: "/create-profile",
    element: <CreateProfile />,
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
          {
            path: "settings",
            element: <Settings />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <Profile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "jobs",
            element: <JobPage />,
            errorElement: <ErrorPage />,
          },
          {
            path: "explore",
            element: <Explore />,
            errorElement: <ErrorPage />,
          },
          {
            path: "jobs/:id",
            element: <JobDetailContainer />,
            errorElement: <ErrorPage />,
          },
          {
            path: "/notifications",
            element: <Notifications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "chat",
            element: (
              <SocketProvider>
                <Chat />
              </SocketProvider>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "/user/:name",
            element: <UserProfilePage />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["user"]} />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "jobs/applied-jobs",
            element: <AppliedJobs />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["company"]} />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "jobs/add-job",
            element: <AddJob />,
            errorElement: <ErrorPage />,
          },
          {
            path: "jobs/edit/:id",
            element: <AddJob />,
            errorElement: <ErrorPage />,
          },
        ],
      },
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
