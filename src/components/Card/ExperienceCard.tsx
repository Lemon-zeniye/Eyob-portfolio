import { useState } from "react";
import ExpAndEduCard from "./ExpAndEduCard";
import AddExprience from "../Profile/AddExprience";
import { useMutation, useQuery } from "react-query";
import { getUserCV, getUserExperience, uploadCV } from "@/Api/profile.api";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatDateToMonthYear } from "@/lib/utils";

const ExperienceCard = () => {
  const [open, setOpen] = useState(false);
  const [openUploadCV, setOpenUploadCV] = useState(false);
  const [viewCV, setViewCV] = useState(false);

  const [file, setFile] = useState(null);

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
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const { data: userCV } = useQuery({
    queryKey: ["userCV"],
    queryFn: getUserCV,
  });

  const { data: experiences } = useQuery({
    queryKey: ["experiences"],
    queryFn: getUserExperience,
  });

  const fileUrl = `/${userCV?.data?.path.replace("public/", "")}`;

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("uploadCV", file);
    upload(formData);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-2 justify-end items-end px-2">
        <Button
          variant="outline"
          className="border-primary"
          onClick={() => setOpenUploadCV(true)}
        >
          Upload CV
        </Button>
        <Button
          variant="outline"
          className="border-primary"
          onClick={() => setViewCV(true)}
        >
          View CV
        </Button>
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
              {experiences &&
                experiences?.data.map((item, index) => (
                  <ExpAndEduCard
                    id={item._id}
                    key={index}
                    institution={item.entity}
                    date={`${formatDateToMonthYear(
                      item.startDate
                    )} - ${formatDateToMonthYear(item.endDate)}`}
                    location={item.location}
                    title={item.jobTitle}
                    isNotSkills
                    type="Exp"
                    locationType={item.locationType}
                    onClick={() => {}}
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
                Add Experience
              </h1>
              <AddExprience onSuccess={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog.Root open={openUploadCV} onOpenChange={setOpenUploadCV}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold">
                Upload CV
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white file:hover:bg-primary/80"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Submit"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={viewCV} onOpenChange={setViewCV}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl focus:outline-none">
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
