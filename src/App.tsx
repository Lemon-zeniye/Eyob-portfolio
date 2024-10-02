import Login from "./Pages/Authentication/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Pages/Authentication/Signup";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
