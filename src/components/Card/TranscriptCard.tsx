import { useRole } from "@/Context/RoleContext";
import { UserFile } from "@/Types/profile.type";
import { useState } from "react";
import { FiEye, FiDownload } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatImageUrl } from "@/lib/utils";
import PDFViewer from "../Profile/DocumentViewer";

function TranscriptCard({ transcript }: { transcript: UserFile }) {
  const { mode } = useRole();
  const textColorClass = mode === "formal" ? "text-primary" : "text-primary2";
  const [viewFile, setViewFile] = useState(false);

  // Format the createdAt date
  const formattedDate = new Date(transcript.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const fileUrl = formatImageUrl(transcript?.path);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${textColorClass}`}>
          {transcript.filename}
        </p>
        <p className="text-xs text-gray-500">Uploaded: {formattedDate}</p>
      </div>

      <div className="flex items-center space-x-3 ml-4">
        <button
          className={`p-2 rounded-full hover:bg-gray-100 ${textColorClass}`}
          aria-label="View transcript"
          onClick={() => setViewFile(true)}
        >
          <FiEye size={18} />
        </button>
        <button
          className={`p-2 rounded-full hover:bg-gray-100 ${textColorClass}`}
          aria-label="Download transcript"
        >
          <a
            href={fileUrl}
            download={`certificate-${transcript?.filename}.pdf`} // This forces download with a proper filename
            className={`p-2 rounded-full hover:bg-gray-100 ${textColorClass}`}
            title="Download PDF"
            target="_blank" // Opens in new tab if it doesn't download
            rel="noopener noreferrer" // Security best practice
          >
            <FiDownload size={20} />
          </a>
        </button>
      </div>

      <Dialog.Root open={viewFile} onOpenChange={setViewFile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl focus:outline-none">
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="text-lg font-semibold">
                Transcript Preview
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
                  <PDFViewer fileUrl={fileUrl} />
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default TranscriptCard;
