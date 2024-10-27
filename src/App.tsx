import Login from "./Pages/Authentication/Login"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom"
import Signup from "./Pages/Authentication/Signup"
import Sidebar from "./Pages/Main/Sidebar"
import Settings from "./Pages/Settings"
import Profile from "./Pages/Profile"
import Jobs from "./Pages/Jobs"
import { AuthProvider, useAuth } from "./Context/AuthContext"
import { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { isLoggedIn } = useAuth()
//   return isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />
// }

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
    element: <Sidebar />,
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
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
