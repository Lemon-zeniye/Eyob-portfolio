import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import { useQuery } from "react-query";
import { getUserOrganization } from "@/Api/profile.api";
import { motion, AnimatePresence } from "framer-motion";
import AddOrganization from "../Profile/AddOrganization";
import { useRole } from "@/Context/RoleContext";
import ExpAndEduCardSocial from "./ExpAndEduCardSocial";
import { Organization } from "@/Types/profile.type";
import { FiPlus, FiX } from "react-icons/fi";

const OrganizationCard = ({
  otherUserOrganization,
}: {
  otherUserOrganization: Organization[] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const { data: organizations } = useQuery({
    queryKey: ["organization"],
    queryFn: getUserOrganization,
  });
  const [initialData, setInitialData] = useState<Organization | undefined>(
    undefined
  );
  const { mode } = useRole();
  const displayData = otherUserOrganization || organizations?.data;

  return (
    <div className="flex flex-col gap-5">
      {!otherUserOrganization && (
        <div className="flex flex-row gap-2 justify-between items-center px-2">
          {open ? (
            <h1 className="text-lg p-2 items-center font-semibold">
              Add Organization
            </h1>
          ) : (
            <div></div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className={`
              p-3 rounded-full transition-all duration-300
              ${
                !open
                  ? mode === "formal"
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-primary2 hover:bg-primary2/90 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
              shadow-md hover:shadow-lg
              transform hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${!open ? "focus:ring-primary" : "focus:ring-red-500"}
            `}
          >
            {open ? <FiX size={20} /> : <FiPlus size={20} />}
          </button>
        </div>
      )}

      <div className="relative">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="education-list"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10"
            >
              {displayData &&
                (mode === "formal"
                  ? displayData?.map((item) => (
                      <ExpAndEduCard
                        key={item._id} // Simplified key (no suffix needed)
                        id={item._id}
                        isNotSkills={false}
                        title={item.organizationName}
                        type="Org"
                        category={item.organizationType}
                        orgEmail={item.email}
                        orgLogo={item.path}
                        showIcon={!otherUserOrganization}
                        onClick={(id: string) => {
                          const org = displayData?.find(
                            (org) => org._id === id
                          );
                          setInitialData(org);
                          setOpen(true);
                        }}
                      />
                    ))
                  : displayData?.map((item) => (
                      <ExpAndEduCardSocial
                        key={item._id} // Simplified key (no suffix needed)
                        id={item._id}
                        isNotSkills={false}
                        title={item.organizationName}
                        type="Org"
                        category={item.organizationType}
                        orgEmail={item.email}
                        orgLogo={item.path}
                        showIcon={!otherUserOrganization}
                        onClick={(id: string) => {
                          const org = displayData?.find(
                            (org) => org._id === id
                          );
                          setInitialData(org);
                          setOpen(true);
                        }}
                      />
                    )))}
            </motion.div>
          ) : (
            <motion.div
              key="add-education"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
            >
              <AddOrganization
                initialData={initialData}
                onSuccess={() => setOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrganizationCard;
