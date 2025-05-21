import ProfileCardSocial from "@/components/Card/ProfileCard_social";
import ProfileCardNormal from "@/components/Card/ProfileCard";
import CompanyProfileCardNormal from "@/components/Profile/CompanyProfile";
import { useRole } from "@/Context/RoleContext";
import CompanyProfileCardSocial from "@/components/Profile/CompanyProfileCardSocial";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { role, mode } = useRole();

  return (
    <div className="w-full pr-5 flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${role}-${mode}`} // This ensures animation triggers when either role or mode changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
        >
          {role === "company" ? (
            mode === "social" ? (
              <CompanyProfileCardSocial />
            ) : (
              <CompanyProfileCardNormal />
            )
          ) : mode === "social" ? (
            <ProfileCardSocial otherUser={undefined} />
          ) : (
            <ProfileCardNormal otherUser={undefined} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Profile;
