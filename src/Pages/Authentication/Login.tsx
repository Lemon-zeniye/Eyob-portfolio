// import logo from "../assets/logo_2.png";
// import { ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
import LoginForm from "@/components/Forms/LoginForm";
import bgImage from "../../assets/bg.png";

const Login: React.FC = () => {
  return (
    <div className="flex flex-row justify-between h-screen overflow-y-hidden">
      <div className="lg:w-1/2 mx-auto w-full flex flex-col  px-2 md:px-8r justify-between bg-white">
        <div
          className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
