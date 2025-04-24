import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import { useQuery } from "react-query";
import { getUserOrganization } from "@/Api/profile.api";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AddOrganization from "../Profile/AddOrganization";

const OrganizationCard = () => {
  const [open, setOpen] = useState(false);
  const { data: skills } = useQuery({
    queryKey: ["organization"],
    queryFn: getUserOrganization,
  });

  console.log("org]", skills);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-2 justify-end items-end px-2">
        <Button
          className={`${
            !open
              ? "bg-primary hover:bg-primary/80"
              : "bg-red-500 hover:bg-red-500/80"
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? "Cancel" : "Add"}
        </Button>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="education-list"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-10 px-2"
            >
              {skills &&
                skills?.data.map((item, index) => (
                  <ExpAndEduCard
                    id={item._id}
                    key={index}
                    isNotSkills={false}
                    title={item.organizationName}
                    type="Org"
                    category={item.organizationType}
                    orgEmail={item.email}
                  />
                ))}
            </motion.div>
          ) : (
            <motion.div
              key="add-education"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
            >
              <h1 className="text-lg py-2 items-center font-semibold">
                Add Organization
              </h1>
              <AddOrganization onSuccess={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrganizationCard;
