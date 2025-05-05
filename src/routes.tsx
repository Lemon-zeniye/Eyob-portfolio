import { createBrowserRouter } from "react-router-dom";

import Login from "./Pages/Authentication/Login";
import Signup from "./Pages/Authentication/Signup";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import Chat from "./Pages/Chat";
import CreateProfile from "./Pages/CreateProfile";
import Home from "./Pages/Home";
import AppliedJobs from "./Pages/AppliedJobs";
import AddJob from "./components/Jobs/AddJob";
import JobPage from "./Pages/JobPage";
import AppLayout from "./Pages/AppLayout";
import PrivateRoute from "./Context/PrivateRoute";
import { SocketProvider } from "./Context/SocketProvider";
import JobDetailNew from "./components/Jobs/JobDetailNew";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/create-profile",
    element: <CreateProfile />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        element: <PrivateRoute allowedRoles={["user", "company"]} />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "jobs",
            element: <JobPage />,
          },
          {
            path: "jobs/:id",
            element: <JobDetailNew />,
          },
          {
            path: "chat",
            element: (
              <SocketProvider>
                <Chat />
              </SocketProvider>
            ),
          },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["user"]} />,
        children: [
          {
            path: "jobs/applied-jobs",
            element: <AppliedJobs />,
          },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["company"]} />,
        children: [
          {
            path: "jobs/add-job",
            element: <AddJob />,
          },
        ],
      },
    ],
  },
]);
