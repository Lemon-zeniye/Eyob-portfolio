import { useRole } from "@/Context/RoleContext";
import { FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { mode } = useRole();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center p-8 rounded-xl bg-white shadow-lg">
        <div className="flex justify-center">
          <FiLock size={64} className="text-gray-300" />
        </div>
        <h1
          className={`text-5xl font-bold mt-6 mb-2 ${
            mode === "formal" ? " text-primary" : " text-primary2"
          }`}
        >
          401
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please sign in with the
          right credentials.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/login")}
            className={`px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity ${
              mode === "formal" ? "bg-primary" : "bg-primary2"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
