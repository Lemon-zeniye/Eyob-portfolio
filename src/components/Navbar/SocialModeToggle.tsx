import { updateUserMode } from "@/Api/profile.api";
import { useRole } from "@/Context/RoleContext";
import { tos } from "@/lib/utils";
import { Mode } from "@/Types/auth.type";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { FaBriefcase } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { useMutation } from "react-query";

const SocialModeToggle = () => {
  const { mode, setMode } = useRole();

  // const { data } = useQuery({
  //   queryKey: ["userMode"],
  //   queryFn: getUserMode,
  // });

  const { mutate } = useMutation({
    mutationFn: updateUserMode,
    onSuccess: () => {
      tos.success("Success");
    },
  });

  const toggleMode = () => {
    const currentMode: Mode = mode === "social" ? "formal" : "social";
    Cookies.set("mode", currentMode);
    setMode(currentMode);
    mutate(currentMode);
  };

  return (
    <motion.button
      onClick={toggleMode}
      className={`relative flex items-center justify-center p-[0.15rem]  `}
      whileTap={{ scale: 0.95 }}
      aria-label={
        mode === "social" ? "Switch to work mode" : "Switch to social mode"
      }
    >
      <div
        className={`relative w-7 h-6 flex items-center border-2   ${
          mode === "social" ? "border-[#FFA500]" : "border-primary"
        } rounded-sm  justify-center overflow-hidden`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mode === "social" ? (
            <motion.div
              key="social"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute"
            >
              <IoGameController size={22} className="text-[#FFA500]" />
            </motion.div>
          ) : (
            <motion.div
              key="work"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute"
            >
              <FaBriefcase size={18} className="text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default SocialModeToggle;
