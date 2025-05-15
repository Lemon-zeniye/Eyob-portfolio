import { useRole } from "@/Context/RoleContext";
import { motion, AnimatePresence } from "framer-motion";
import SocialHomePage from "./SocialHomePage";
import NormalHomePage from "./NormalHomePage";

function HomePage() {
  const { mode } = useRole();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: mode === "social" ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: mode === "social" ? -50 : 50 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {mode === "social" ? <SocialHomePage /> : <NormalHomePage />}
      </motion.div>
    </AnimatePresence>
  );
}

export default HomePage;
