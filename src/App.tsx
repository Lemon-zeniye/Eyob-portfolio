import { RouterProvider } from "react-router-dom";
import "@fontsource/outfit/latin.css";
import { router } from "./routes";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
