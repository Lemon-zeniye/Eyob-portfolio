import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import AddEducation from "../Profile/AddEducation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { getCertification, getEducations } from "@/Api/profile.api";
import { Button } from "../ui/button";
import AddCertification from "../Profile/AddCertification";
import { useRole } from "@/Context/RoleContext";
import ExpAndEduCardSocial from "./ExpAndEduCardSocial";
import { UserEducation } from "../Types";
import { FiEye, FiPlus, FiUpload, FiX } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import CertificateCard from "./CertificateCard";

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
  const [viewCertification, setViewCertification] = useState(false);
  const [addCertificate, setAddCertificate] = useState(true);

  const { data: educations } = useQuery({
    queryKey: ["educations"],
    queryFn: getEducations,
    enabled: !otherUserEducation,
  });

  const { data: certifications } = useQuery({
    queryKey: ["certification"],
    queryFn: getCertification,
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
                  className="border-primary flex items-center gap-2 p-3"
                  onClick={() => {
                    setCertification(true);
                    setAddCertificate(true);
                  }}
                >
                  <FiUpload size={20} /> <span>Certification</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-primary flex items-center gap-2 p-3"
                  onClick={() => {
                    setCertification(true);
                    setAddCertificate(false);
                  }}
                >
                  <FiEye size={20} /> <span>Certification</span>
                </Button>
                <Button
                  className={` p-3 rounded-full transition-all duration-300 ${
                    mode === "formal"
                      ? "bg-primary hover:bg-primary/80 "
                      : "bg-primary2 hover:bg-primary2/80 "
                  }`}
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
                <div>
                  <motion.div
                    key="add-certificate"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", ease: "easeInOut" }}
                  >
                    {addCertificate ? (
                      <AddCertification onSuccess={() => setOpen(false)} />
                    ) : (
                      certifications?.data && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {certifications?.data.map((cert) => (
                            <CertificateCard
                              key={cert._id}
                              certificate={cert}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Dialog.Root open={viewCertification} onOpenChange={setViewCertification}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="text-lg font-semibold">
                CV Preview
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="h-full border rounded-md overflow-hidden">
              {/* {fileUrl && (
                <div
                  style={{
                    marginTop: "20px",
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  <DocumentViewer fileUrl={fileUrl} />
                </div>
              )} */}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default EducationCard;
