import { Certificate } from "@/Types/profile.type";
import { format } from "date-fns";
import { useState } from "react";
import { FiAward, FiCalendar, FiDownload, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import { useRole } from "@/Context/RoleContext";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatImageUrl } from "@/lib/utils";
import DocumentViewer from "../Profile/DocumentViewer";

const CertificateCard = ({ certificate }: { certificate: Certificate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { mode } = useRole();
  const [open, setOpen] = useState(false);
  const fileUrl = formatImageUrl(certificate.path);
  return (
    <>
      {mode === "social" ? (
        <motion.div
          whileHover={{ y: -2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative rounded-xl p-5 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden
    ${isHovered ? "ring-1 ring-opacity-20" : ""}
    ring-blue-200`}
        >
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-b from-[#ffa500]/50 to-[#ffa500]" />

          <div className="flex gap-4 items-start">
            {/* Icon container */}
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#ffa500]/50 to-[#ffa500] text-white">
              <FiAward size={20} /> {/* Assuming you're using Feather icons */}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">
                  {certificate.certificateName}
                </h3>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {certificate.certificateNumber}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Certified By: {certificate.certifiedBy}
              </p>
              <div className="mt-3">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    Expires:{" "}
                    {format(new Date(certificate.expireDate), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <span onClick={() => setOpen(true)}>
                  <FiEye className="h-5 w-5" />
                </span>
                <a
                  href={fileUrl}
                  download={`certificate-${certificate.certificateNumber}.pdf`} // This forces download with a proper filename
                  className="text-gray-600 hover:text-primary transition-colors"
                  title="Download PDF"
                  target="_blank" // Opens in new tab if it doesn't download
                  rel="noopener noreferrer" // Security best practice
                >
                  <FiDownload size={20} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ y: -2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative px-5 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
        >
          <div className="flex flex-row gap-5 py-4">
            {/* Icon container - matches the first card's style */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 md:h-28 md:w-28 rounded-full flex items-center justify-center border-2 text-primary border-primary bg-[#daf2f2]">
              <FiAward size={40} />
            </div>

            {/* Content - matches the first card's structure */}
            <div className="flex flex-col gap-2 justify-center">
              <div>
                <p className="text-lg font-semibold">
                  {certificate.certificateName}
                </p>
                <p className="text-base font-normal opacity-50">
                  Certified By: {certificate.certifiedBy}
                </p>
                <p className="text-base font-normal opacity-50">
                  #{certificate.certificateNumber}
                </p>
              </div>

              <div>
                <div className="flex text-sm items-center gap-4">
                  <p className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    Expires:{" "}
                    {format(new Date(certificate.expireDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <span onClick={() => setOpen(true)}>
                  <FiEye className="h-5 w-5" />
                </span>
                <a
                  href={fileUrl}
                  download={`certificate-${certificate.certificateNumber}.pdf`} // This forces download with a proper filename
                  className="text-gray-600 hover:text-primary transition-colors"
                  title="Download PDF"
                  target="_blank" // Opens in new tab if it doesn't download
                  rel="noopener noreferrer" // Security best practice
                >
                  <FiDownload size={20} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <Dialog.Root open={open} onOpenChange={setOpen}>
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
              {fileUrl && (
                <div
                  style={{
                    marginTop: "20px",
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  <DocumentViewer fileUrl={fileUrl} />
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default CertificateCard;
