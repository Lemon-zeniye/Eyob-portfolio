import { createBrowserRouter } from "react-router-dom";

import { NotFoundPage } from "./Pages/NotFoundPage";
import { ErrorPage } from "./Pages/ErrorPage";
import Gallery from "./Pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Gallery />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
]);
