import { useMutation, useQuery, useQueryClient } from "react-query";
import { addEmployee, getActiveUsers } from "@/Api/profile.api";
import { tos } from "@/lib/utils";

import { useMemo, useState } from "react";
import { useRole } from "@/Context/RoleContext";
import { Spinner } from "../ui/Spinner";

function AddEmployee({ onSuccess }: { onSuccess: () => void }) {
  const { data: activeUsers } = useQuery({
    queryKey: ["activeUser"],
    queryFn: getActiveUsers,
  });
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      tos.success("Success");
      queryClient.invalidateQueries("employees");
      onSuccess();
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    empPosition: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    empPosition: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!activeUsers?.data) return [];
    return activeUsers.data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeUsers, searchTerm]);

  const { mode } = useRole();

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleUserSelect = (user: any) => {
    setFormData({
      ...formData,
      name: user.email,
    });
    setSearchTerm(user.email);
    setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (name === "name") {
      setSearchTerm(e.target.value);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.name)) {
      newErrors.name = "Invalid email format";
      valid = false;
    }

    if (!formData.empPosition.trim()) {
      newErrors.empPosition = "Role is required";
      valid = false;
    } else if (formData.empPosition.length < 3) {
      newErrors.empPosition = "Role must be at least 3 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutate(formData);
    }
  };

  return (
    <div>
      <form className="" onSubmit={onSubmit}>
        <div className="relative">
          <label className="hidden md:block text-sm font-medium text-gray-700">
            Select User or Enter Email
          </label>
          <input
            type="text"
            name="name"
            placeholder="Search users or enter email..."
            className={`flex  px-3 py-2 mt-1 border border-gray-300 bg-transparent rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 w-full `}
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={handleBlur}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}

          {showDropdown && filteredUsers.length > 0 && (
            <div className="absolute z-50 mt-1 w-full md:w-[70%] lg:w-[50%] rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 border rounded-full flex items-center justify-center bg-white font-medium">
                      {user?.name?.slice(0, 1)?.toUpperCase()}
                    </div>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role field */}
        <div className="w-full mt-4">
          <label>Role</label>
          <input
            type="text"
            name="empPosition"
            placeholder="Role"
            className="flex h-10 w-full px-3 py-2 mt-1 border border-gray-300 bg-transparent rounded-md shadow-sm text-sm focus:outline-none focus:ring-1"
            value={formData.empPosition}
            onChange={handleChange}
          />
          {errors.empPosition && (
            <p className="mt-1 text-sm text-red-600">{errors.empPosition}</p>
          )}
        </div>

        <div className="flex items-center mt-4 justify-end">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              mode === "formal" ? "bg-primary" : "bg-primary2"
            }`}
          >
            {isLoading ? <Spinner /> : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
