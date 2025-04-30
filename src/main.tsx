import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster as CustomToaster } from "./components/ui/toaster.tsx";
import Providers from "./Providers/providers.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { RoleProvider } from "./Context/RoleContext.tsx";
import { AuthProvider } from "./Context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="195047541516-ihgd0pebuld9h8le27mdpogiq7c5d5fn.apps.googleusercontent.com">
      <RoleProvider>
        <AuthProvider>
          <Providers>
            <App />
            <Toaster />
            <CustomToaster />
          </Providers>
        </AuthProvider>
      </RoleProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
