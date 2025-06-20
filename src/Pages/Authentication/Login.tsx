// import logo from "../assets/logo_2.png";
// import { ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
import LoginForm from "@/components/Forms/LoginForm";
import bgImage from "../../assets/bg.png";

const Login: React.FC = () => {
  return (
    <div
      className="flex max-w-md mx-auto flex-col min-h-screen bg-cover bg-center  bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <LoginForm />
    </div>
  );
};

export default Login;
