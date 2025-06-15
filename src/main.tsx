import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster as CustomToaster } from "./components/ui/toaster.tsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { RoleProvider } from "./Context/RoleContext.tsx";
import { AuthProvider } from "./Context/AuthContext";
import Providers from "./Providers/providers.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoleProvider>
      <AuthProvider>
        {/* <GoogleOAuthProvider clientId="195047541516-ihgd0pebuld9h8le27mdpogiq7c5d5fn.apps.googleusercontent.com"> */}
        <Providers>
          <App />
          <Toaster />
          <CustomToaster />
        </Providers>
        {/* </GoogleOAuthProvider> */}
      </AuthProvider>
    </RoleProvider>
  </StrictMode>
);
