// import logo from "../assets/logo_2.png";
// import { ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
import LoginForm from "@/components/Forms/LoginForm";
import bgImage from "../../assets/bg.png";

const Login: React.FC = () => {
  return (
    <div
      className="flex flex-col max-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <LoginForm />
    </div>
  );
};

export default Login;
