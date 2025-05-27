import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import AddEducation from "../Profile/AddEducation";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "react-query";
import {
  getCertification,
  getEducations,
  getUserTranscript,
  uploadUserTranscript,
} from "@/Api/profile.api";
import { Button } from "../ui/button";
import AddCertification from "../Profile/AddCertification";
import { useRole } from "@/Context/RoleContext";
import ExpAndEduCardSocial from "./ExpAndEduCardSocial";
import { UserEducation } from "../Types";
import {
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiFile,
  FiPlus,
  FiUpload,
  FiX,
} from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import CertificateCard from "./CertificateCard";
import { tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";
import TranscriptCard from "./TranscriptCard";

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
  const [addCertificate, setAddCertificate] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const [transcriptAction, setTranscriptAction] = useState(false);
  const [uploadTranscript, setUploadTranscript] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(selectedFile.type)
    ) {
      setFile(selectedFile);
    } else {
      alert("Only PDF or Word documents are allowed.");
      setFile(null);
    }
  };

  const { mutate: upload, isLoading: uploading } = useMutation({
    mutationFn: uploadUserTranscript,
    onSuccess: () => {
      setUploadTranscript(false);
      setFile(null);
      tos.success("Transcript uploaded successfully");
      // queryClient.invalidateQueries(["userCV"]);
    },
    onError: (error) => {
      const mes = getAxiosErrorMessage(error);
      tos.error(mes);
    },
  });

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("uploadUnOfficial", file);
    upload(formData);
  };

  const { data: userTranscripts } = useQuery({
    queryKey: ["userTranscript"],
    queryFn: getUserTranscript,
    onSuccess: () => {},
    enabled: !otherUserEducation,
  });

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // const fileUrl = `https://awema.co/${userTranscript?.data?.path?.replace(
  //   "public/",
  //   ""
  // )}`;

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
            {!open && !certification && !transcriptAction && (
              <>
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={toggleDropdown}
                    >
                      Documents
                      {isOpen ? (
                        <FiChevronUp className="ml-2 h-5 w-5" />
                      ) : (
                        <FiChevronDown className="ml-2 h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                      <div className="py-1" role="none">
                        {/* Certification Buttons */}
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                          onClick={() => {
                            setCertification(true);
                            setAddCertificate(true);
                            setIsOpen(false);
                          }}
                        >
                          <FiUpload size={16} /> Upload Certification
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                          onClick={() => {
                            setCertification(true);
                            setAddCertificate(false);
                            setIsOpen(false);
                          }}
                        >
                          <FiEye size={16} /> View Certification
                        </button>

                        {/* Transcript Buttons */}
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                          onClick={() => {
                            setUploadTranscript(true);
                            setIsOpen(false);
                          }}
                        >
                          <FiUpload size={16} /> Unofficial Transcript
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                          onClick={() => {
                            setTranscriptAction(true);
                            setUploadTranscript(false);
                            setIsOpen(false);
                          }}
                        >
                          <FiEye size={16} /> Unofficial Transcript
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

            {open || certification || transcriptAction ? (
              <Button
                className={
                  "bg-red-500 hover:bg-red-500/80  p-3 rounded-full transition-all duration-300"
                }
                onClick={() => {
                  setOpen(false);
                  setCertification(false);
                  setTranscriptAction(false);
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
          {!open && !certification && !transcriptAction ? (
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
                      <AddCertification
                        onSuccess={() => {
                          setOpen(false);
                          setAddCertificate(false);
                        }}
                      />
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
              {transcriptAction && (
                <motion.div
                  key="add-certificate"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", ease: "easeInOut" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userTranscripts?.data.map((tran) => (
                      <TranscriptCard key={tran._id} transcript={tran} />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog.Root open={uploadTranscript} onOpenChange={setUploadTranscript}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold">
                Upload Unofficial Transcript
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {/* Hidden file input */}
              <input
                type="file"
                id="cv-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Custom upload area */}
              <label
                htmlFor="cv-upload"
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors hover:bg-gray-50"
              >
                <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-primary">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, or DOCX (Max. 5MB)
                </p>
              </label>

              {/* Selected file display */}
              {file && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <FiFile className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">{file?.name}</span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <Spinner className="mr-2" />
                    Uploading...
                  </div>
                ) : (
                  "Upload Transcript"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default EducationCard;
