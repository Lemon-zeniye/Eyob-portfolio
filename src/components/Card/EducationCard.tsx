import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import AddEducation from "../Profile/AddEducation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { getEducations } from "@/Api/profile.api";
import { Button } from "../ui/button";
import AddCertification from "../Profile/AddCertification";
import { useRole } from "@/Context/RoleContext";
import ExpAndEduCardSocial from "./ExpAndEduCardSocial";
import { UserEducation } from "../Types";
import { FiAward, FiPlus, FiX } from "react-icons/fi";

const EducationCard = ({
  otherUserEducation,
}: {
  otherUserEducation: UserEducation[] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [certification, setCertification] = useState(false);
  const { mode } = useRole();
  const [initialData, setInitialData] = useState<UserEducation | undefined>(
    undefined
  );

  const { data: educations } = useQuery({
    queryKey: ["educations"],
    queryFn: getEducations,
    enabled: !otherUserEducation,
  });
  const displayData = otherUserEducation || educations?.data;

  return (
    <div className="flex flex-col gap-5 relative overflow-hidden">
      {!otherUserEducation && (
        <div className="flex flex-row gap-2 justify-between items-end px-2">
          <h1 className="text-lg p-2 items-center font-semibold">
            {open ? (
              "Add Education"
            ) : certification ? (
              "Add Certification"
            ) : (
              <div></div>
            )}
          </h1>
          <div className="flex gap-2">
            {!open && !certification && (
              <>
                <Button
                  variant="outline"
                  className="border-primary p-3"
                  onClick={() => {
                    setCertification(true);
                  }}
                >
                  <FiAward size={20} />
                </Button>
                <Button
                  className={
                    "bg-primary hover:bg-primary/80  p-3 rounded-full transition-all duration-300"
                  }
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <FiPlus size={20} />
                </Button>
              </>
            )}

            {open || certification ? (
              <Button
                className={
                  "bg-red-500 hover:bg-red-500/80  p-3 rounded-full transition-all duration-300"
                }
                onClick={() => {
                  setOpen(false);
                  setCertification(false);
                }}
              >
                <FiX size={20} />
              </Button>
            ) : null}
          </div>
        </div>
      )}

      <div className="relative">
        <AnimatePresence mode="wait">
          {!open && !certification ? (
            <motion.div
              key="education-list"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-10 px-2"
            >
              {displayData &&
                (mode === "formal"
                  ? displayData.map((item) => (
                      <ExpAndEduCard
                        key={item._id} // Just use item._id, no need for suffix
                        id={item._id}
                        institution={item.institution}
                        date={`${item.graduationYear}`}
                        location={""}
                        type="Edu"
                        title={item.degree}
                        gpa={item.gpa}
                        isNotSkills
                        showIcon={!otherUserEducation}
                        onClick={(id) => {
                          const edu = displayData.find((edu) => edu._id === id);
                          setOpen(true);
                          setInitialData(edu);
                        }}
                      />
                    ))
                  : displayData?.map((item) => (
                      <ExpAndEduCardSocial
                        key={item._id} // Just use item._id, no need for suffix
                        id={item._id}
                        institution={item.institution}
                        date={`${item.graduationYear}`}
                        location={""}
                        type="Edu"
                        title={item.degree}
                        gpa={item.gpa}
                        isNotSkills
                        showIcon={!otherUserEducation}
                        onClick={(id) => {
                          const edu = displayData.find((edu) => edu._id === id);
                          setOpen(true);
                          setInitialData(edu);
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
              {open && (
                <AddEducation
                  initialData={initialData}
                  onSuccess={() => setOpen(false)}
                />
              )}
              {certification && (
                <AddCertification onSuccess={() => setOpen(false)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EducationCard;
