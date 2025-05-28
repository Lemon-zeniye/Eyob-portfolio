import { ChevronLeft } from "lucide-react";
import SignupForm from "@/components/Forms/SignupForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/bevylogo.svg";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between lg:h-screen overflow-y-hidden">
      <div className="lg:w-1/2 sm-phone:hidden bg-primary lg:flex items-center justify-center">
        <div className="flex flex-col gap-1 items-center">
          <p className="text-white text-h2 font-bold ">
            <img src={logo} className="w-32 h-auto" alt="Logo" />
          </p>
        </div>
      </div>
      <div className="lg:w-1/2 sm-phone:w-full flex flex-col sm-phone:py-4 lg:py-14 px-8r justify-between bg-white">
        <div onClick={() => navigate("/login")}>
          <Button className="px-0" variant={"ghost"}>
            <div className="flex flex-row items-center">
              <ChevronLeft className="text-primary" />
              <p className="text-body">Back</p>
            </div>
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <SignupForm />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Signup;
