import { useRole } from "@/Context/RoleContext";
import { FiAlertTriangle, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();
  const { mode } = useRole();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center p-8 rounded-xl bg-white shadow-lg">
        <div className="flex justify-center">
          <FiAlertTriangle size={64} className="text-red-500" />
        </div>
        <h1
          className={`text-5xl font-bold mt-6 mb-2${
            mode === "formal" ? " text-primary" : " text-primary2"
          }`}
        >
          Oops!
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but an unexpected error has occurred. Our team has been
          notified.
        </p>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
          <div className="flex items-center">
            <FiMail className="text-red-500 mr-2" />
            <span className="font-medium">Please contact our developer:</span>
          </div>
          <a
            href="mailto:dev@example.com"
            className="text-red-600 hover:underline mt-1 inline-block"
          >
            akilo@gmail.com
          </a>
        </div>
        <button
          onClick={() => navigate("/")}
          className={`px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity ${
            mode === "formal" ? "bg-primary" : "bg-primary2"
          }`}
        >
          Return to Safety
        </button>
      </div>
    </div>
  );
};
