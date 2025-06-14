import ProfileCardSocial from "@/components/Card/ProfileCard_social";
import ProfileCardNormal from "@/components/Card/ProfileCard";
import CompanyProfileCardNormal from "@/components/Profile/CompanyProfile";
import { useRole } from "@/Context/RoleContext";
import CompanyProfileCardSocial from "@/components/Profile/CompanyProfileCardSocial";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import { getUserFullProfile } from "@/Api/profile.api";
import { useState } from "react";

const Profile = () => {
  const { role, mode } = useRole();
  const userId = Cookies.get("userId");
  const [userOpenToWork, setUserOpenToWork] = useState(false);

  useQuery({
    queryKey: ["getUserFullProfile", userId],
    queryFn: () => {
      if (userId) {
        return getUserFullProfile(userId);
      }
    },
    onSuccess: (res) => {
      const isOpenToWork = res?.data?.openToWork ?? false;
      setUserOpenToWork(isOpenToWork);
    },
    enabled: !!userId,
  });

  return (
    <div className="w-full flex flex-col mb-10">
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
            <ProfileCardSocial
              otherUser={undefined}
              isOtherUser={false}
              userOpenToWork={userOpenToWork}
            />
          ) : (
            <ProfileCardNormal
              otherUser={undefined}
              isOtherUser={false}
              userOpenToWork={userOpenToWork}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Profile;
