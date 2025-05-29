import { useRole } from "@/Context/RoleContext";
import { FiCompass } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { mode } = useRole();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center p-8 rounded-xl bg-white shadow-lg">
        <div className="flex justify-center">
          <FiCompass size={64} className="text-gray-300" />
        </div>
        <h1
          className={`text-5xl font-bold mt-6 mb-2 ${
            mode === "formal" ? "text-primary" : "text-primary2"
          } `}
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className={`px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity ${
            mode === "formal" ? "bg-primary" : "bg-primary2"
          } `}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};
