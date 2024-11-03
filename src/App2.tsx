import Login from "./Pages/Authentication/Login"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signup from "./Pages/Authentication/Signup"
import Sidebar from "./Pages/Main/Sidebar"
import Settings from "./Pages/Settings"
import Profile from "./Pages/Profile"
import Jobs from "./Pages/Jobs"
import { AuthProvider, useAuth } from "./Context/AuthContext"
// import { ReactNode } from "react"
import AppliedJobs from "./Pages/AppliedJobs"

// interface ProtectedRouteProps {
//   children: ReactNode
// }

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Sidebar /> : <Login />
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/applied-jobs",
        element: <AppliedJobs />,
      },
    ],
  },
])

function App2() {
  return <RouterProvider router={router} />
}

export default App2
