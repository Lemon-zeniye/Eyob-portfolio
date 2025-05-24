import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { getCompanyAbout } from "@/Api/profile.api";
import AddAbout from "./AddAbout";
import { FiPlus, FiX } from "react-icons/fi";
import { useRole } from "@/Context/RoleContext";
function AboutCard() {
  const [open, setOpen] = useState(false);
  const { data: aboutCompany } = useQuery({
    queryKey: ["companyAbout"],
    queryFn: getCompanyAbout,
  });
  const { mode } = useRole();

  return (
    <div className="mb-12">
      <div className="flex flex-row gap-2 justify-end items-end my-2">
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
      <div className="">
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
              <div>
                <h1 className="text-lg font-semibold">History</h1>
                <p>{aboutCompany?.data?.history}</p>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Website</h1>
                <div>
                  {aboutCompany?.data?.website?.map((d, index) => (
                    <p key={d + index}>{d}</p>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Social Media</h1>
                <div>
                  {aboutCompany?.data?.website?.map((d, index) => (
                    <p key={d + index}>{d}</p>
                  ))}
                </div>
              </div>
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
                {aboutCompany?.data ? "Edit About" : "Add About"}
              </h1>
              <AddAbout
                initialData={aboutCompany?.data}
                onSuccess={() => setOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AboutCard;
