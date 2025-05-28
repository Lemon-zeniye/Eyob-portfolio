import { useRole } from "@/Context/RoleContext";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCardNormal from "@/components/Card/ProfileCard";
import ProfileCardSocial from "@/components/Card/ProfileCard_social";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchSingleProfile, getUserFullProfile } from "@/Api/profile.api";

function UserProfilePage() {
  const { mode } = useRole();
  const location = useLocation();
  const userId = location.state?.id;

  const { data: userFullProfile } = useQuery({
    queryKey: ["getUserFullProfile", userId],
    queryFn: () => {
      if (userId) {
        return getUserFullProfile(userId);
      }
    },
    enabled: !!userId,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["getUserProfile", userId],
    queryFn: () => {
      if (userId) {
        return fetchSingleProfile(userId);
      }
    },
    enabled: !!userId,
  });

  return (
    <div className="w-full pr-5 flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}`} // This ensures animation triggers when either role or mode changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
        >
          {mode === "social" ? (
            <ProfileCardSocial
              otherUser={userFullProfile?.data}
              isOtherUser={true}
              userProfile={userProfile?.data}
            />
          ) : (
            <ProfileCardNormal
              otherUser={userFullProfile?.data}
              isOtherUser={true}
              userProfile={userProfile?.data}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default UserProfilePage;
