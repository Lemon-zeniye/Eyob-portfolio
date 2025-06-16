import { RouterProvider } from "react-router-dom";
import "@fontsource/outfit/latin.css";
import { router } from "./routes";

function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true, // Opt-in to the new behavior
      }}
    />
  );
}

export default App;
