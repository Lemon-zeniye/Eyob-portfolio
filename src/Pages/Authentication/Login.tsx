// import logo from "../assets/logo_2.png";
// import { ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
import LoginForm from "@/components/Forms/LoginForm";
import logo from "../../assets/bevylogo.svg";

const Login: React.FC = () => {
  return (
    <div className="flex flex-row justify-between h-screen overflow-y-hidden">
      <div className="lg:w-1/2 sm-phone:hidden bg-primary lg:flex items-center justify-center">
        <div className="flex flex-col gap-1 items-center">
          <img src={logo} className="w-32 h-auto" alt="Logo" />
        </div>
      </div>
      <div className="lg:w-1/2 sm-phone:w-full flex flex-col py-14 px-8r justify-between bg-white">
        <div>
          {/* <Button className="px-0" onClick={() => {}} variant={"ghost"}>
            <div className="flex flex-row items-center">
              <ChevronLeft className="text-primary" />
              <p className="text-body">Back</p>
            </div>
          </Button> */}
        </div>
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Login;
