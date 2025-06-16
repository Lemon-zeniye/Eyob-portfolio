import { ChevronLeft } from "lucide-react";
import SignupForm from "@/components/Forms/SignupForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between lg:h-screen overflow-y-hidden">
      <div className="lg:w-1/2 mx-auto w-full flex flex-col py-4 lg:py-14 px-6 md:px-8r justify-between bg-white">
        <div onClick={() => navigate("/login")}>
          <Button className="px-0 mb-2" variant={"ghost"}>
            <div className="flex flex-row items-center">
              <ChevronLeft className="text-primary" />
              <p className="text-body">Back</p>
            </div>
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
