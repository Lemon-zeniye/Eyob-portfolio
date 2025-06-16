// import logo from "../assets/logo_2.png";
// import { ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
import LoginForm from "@/components/Forms/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="flex flex-row justify-between h-screen overflow-y-hidden">
      <div className="lg:w-1/2 mx-auto w-full flex flex-col py-14 px-6 md:px-8r justify-between bg-white">
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
