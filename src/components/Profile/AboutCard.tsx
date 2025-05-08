import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useQuery } from "react-query";
import { getCompanyAbout } from "@/Api/profile.api";
import AddAbout from "./AddAbout";
function AboutCard() {
  const [open, setOpen] = useState(false);
  const { data: aboutCompany } = useQuery({
    queryKey: ["companyAbout"],
    queryFn: getCompanyAbout,
  });

  return (
    <div>
      <div className="flex flex-row gap-2 justify-end items-end my-2">
        <Button
          className={`${
            !open
              ? "bg-primary hover:bg-primary/80"
              : "bg-red-500 hover:bg-red-500/80"
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? "Cancel" : aboutCompany?.data ? "Edit" : "Add"}
        </Button>
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
                <p>{aboutCompany?.data.history}</p>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Website</h1>
                <div>
                  {aboutCompany?.data.website?.map((d, index) => (
                    <p key={d + index}>{d}</p>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Social Media</h1>
                <div>
                  {aboutCompany?.data.website?.map((d, index) => (
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
