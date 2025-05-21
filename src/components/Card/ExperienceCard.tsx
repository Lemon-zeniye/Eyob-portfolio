import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import AddExprience from "../Profile/AddExprience";
import { useMutation, useQuery } from "react-query";
import { getUserCV, getUserExperience, uploadCV } from "@/Api/profile.api";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatDateToMonthYear, tos } from "@/lib/utils";
import { Spinner } from "../ui/Spinner";
import { getAxiosSuccessMessage } from "@/Api/axios";
import { useRole } from "@/Context/RoleContext";
import ExpAndEduCardSocial from "./ExpAndEduCardSocial";
import { UserExperience } from "../Types";
import { FiEye, FiFile, FiPlus, FiUpload, FiX } from "react-icons/fi";

const ExperienceCard = ({
  otherUserExperience,
}: {
  otherUserExperience: UserExperience[] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [openUploadCV, setOpenUploadCV] = useState(false);
  const [viewCV, setViewCV] = useState(false);
  const { mode } = useRole();
  const [initialData, setInitialData] = useState<UserExperience | undefined>(
    undefined
  );

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
    mutationFn: uploadCV,
    onSuccess: () => {
      setOpenUploadCV(false);
      setFile(null);
      tos.success("CV uploaded successfully");
    },
    onError: (error) => {
      const mes = getAxiosSuccessMessage(error);
      tos.error(mes);
    },
  });

  const { data: userCV } = useQuery({
    queryKey: ["userCV"],
    queryFn: getUserCV,
    onSuccess: () => {},
    enabled: !otherUserExperience,
  });

  const { data: experiences } = useQuery({
    queryKey: ["experiences"],
    queryFn: getUserExperience,
    enabled: !otherUserExperience,
  });

  const fileUrl = `/${userCV?.data?.path.replace("public/", "")}`;

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("uploadCV", file);
    upload(formData);
  };
  const displayData = otherUserExperience || experiences?.data;

  return (
    <div className="flex flex-col gap-5">
      {!otherUserExperience && (
        <div className="flex items-center justify-between">
          {open ? (
            <h1 className="text-lg py-2 items-center font-semibold">
              Add Experience
            </h1>
          ) : (
            <div></div>
          )}
          <div className="flex flex-row gap-2 justify-end items-end px-2">
            <Button
              variant="outline"
              className="border-primary p-3"
              onClick={() => setOpenUploadCV(true)}
            >
              <FiUpload size={20} />
            </Button>
            <Button
              variant="outline"
              className="border-primary p-3"
              onClick={() => setViewCV(true)}
            >
              <FiEye size={20} />
            </Button>
            <button
              onClick={() => setOpen(!open)}
              className={`
                        p-3 rounded-full transition-all duration-300
                        ${
                          !open
                            ? "bg-primary hover:bg-primary/90 text-white"
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
              className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-10 px-2"
            >
              {displayData && mode === "formal"
                ? displayData.map((item) => (
                    <ExpAndEduCard
                      key={item._id}
                      id={item._id}
                      institution={item.entity}
                      date={`${formatDateToMonthYear(
                        item.startDate
                      )} - ${formatDateToMonthYear(item.endDate)}`}
                      location={item.location}
                      title={item.jobTitle}
                      isNotSkills
                      type="Exp"
                      locationType={item.locationType}
                      showIcon={!otherUserExperience}
                      onClick={(id: string) => {
                        const exp = displayData.find((exp) => exp._id === id);
                        setOpen(true);
                        setInitialData(exp);
                      }}
                    />
                  ))
                : displayData?.map((item) => (
                    <ExpAndEduCardSocial
                      key={item._id}
                      id={item._id}
                      institution={item.entity}
                      date={`${formatDateToMonthYear(
                        item.startDate
                      )} - ${formatDateToMonthYear(item.endDate)}`}
                      location={item.location}
                      title={item.jobTitle}
                      isNotSkills
                      type="Exp"
                      locationType={item.locationType}
                      showIcon={!otherUserExperience}
                      onClick={(id: string) => {
                        const exp = displayData.find((exp) => exp._id === id);
                        setOpen(true);
                        setInitialData(exp);
                      }}
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
              <AddExprience
                initialData={initialData}
                onSuccess={() => setOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog.Root open={openUploadCV} onOpenChange={setOpenUploadCV}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold">
                Upload CV
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
                  "Upload CV"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={viewCV} onOpenChange={setViewCV}>
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
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  `https://awema.co/${fileUrl}`
                )}&embedded=true`}
                className="w-full h-[80vh]"
                frameBorder="0"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ExperienceCard;
