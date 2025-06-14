import { useEffect, useRef, useState } from "react";
import { FaFile, FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { FaVolumeMute } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import {
  MdFullscreen,
  MdFullscreenExit,
  MdOutlineUpload,
} from "react-icons/md";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "react-query";
import { Upload, X } from "lucide-react";
import {
  deleteUserVideo,
  getUserVideo,
  updateUserVideo,
  uploadUserVideo,
} from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/button";
import { formatImageUrl, tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import { UserData } from "@/Types/profile.type";
import { useRole } from "@/Context/RoleContext";

const CustomVideoPlayer = ({
  otherUser,
  isOtherUser,
  fromChat = false,
  showUpload = true,
}: {
  otherUser: UserData | undefined;
  isOtherUser: boolean;
  fromChat?: boolean;
  showUpload?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [thumbnailURL, setThumbnailURL] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { mode } = useRole();

  const otherUserVideo =
    otherUser?.videos[0]?.path && formatImageUrl(otherUser?.videos[0]?.path);

  const [videoURL, setVideoURL] = useState<string | undefined>(otherUserVideo);

  // Fetch video from server
  useQuery({
    queryKey: ["userVedio"],
    queryFn: async () => {
      if (!isOtherUser) {
        return getUserVideo();
      }
      return null;
    },
    enabled: !isOtherUser,
    onSuccess: (response) => {
      if (response && !selectedFile && !isOtherUser) {
        const videoURL = `https://awema.co/${response.data.path.replace(
          "public/",
          ""
        )}`;
        setVideoURL(videoURL);
        setIsUpdate(true);
      }
    },
  });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const captureThumbnail = () => {
      // Seek to a specific time (e.g., 2 seconds)
      video.currentTime = 2;

      video.onseeked = () => {
        // Create a canvas to capture the frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx && ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        setThumbnailURL(canvas?.toDataURL());
      };
    };

    video.addEventListener("loadedmetadata", captureThumbnail);

    return () => {
      video.removeEventListener("loadedmetadata", captureThumbnail);
    };
  }, [videoURL]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: uploadUserVideo,
    onSuccess: () => {
      setSelectedFile(null);
      setOpen(false);
      tos.success("Success");
      setIsUpdate(false);
    },
    onError: (err: any) => {
      const msg = getAxiosErrorMessage(err);
      tos.error(msg);
    },
  });

  const { mutate: updateVideo, isLoading: isVideoLoading } = useMutation({
    mutationFn: updateUserVideo,
    onSuccess: () => {
      setSelectedFile(null);
      setOpen(false);
      tos.success("Success");
      setIsUpdate(false);
    },
    onError: (err: any) => {
      const msg = getAxiosErrorMessage(err);
      tos.error(msg);
    },
  });

  const uploadVideo = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("videoFile", selectedFile);
    if (isUpdate) {
      updateVideo(formData);
    } else {
      mutate(formData);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteUserVideo,
    onSuccess: () => {
      setVideoURL(undefined);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setVideoURL(tempUrl);
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    const videoEl = videoRef.current;

    if (!document.fullscreenElement) {
      if (videoEl?.requestFullscreen) {
        videoEl.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <>
      <div
        className="relative w-full max-w-[1350px] bg-[#D9D9D9]  rounded-lg overflow-hidden border border-[#BFBFBF]/30 group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoURL}
          className={`w-full object-cover ${
            fromChat ? "h-[150px]" : "h-[200px] md:h-[300px] "
          }`}
          loop
          poster={thumbnailURL || undefined}
          muted={isMuted}
        />

        {showControls && (
          <button
            onClick={togglePlayPause}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white  p-5 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
              mode === "formal"
                ? "bg-primary/70 hover:bg-primary/90"
                : "bg-primary2/70 hover:bg-primary2/90"
            }`}
          >
            {isPlaying ? (
              <FaPause size={24} />
            ) : (
              <FaPlay size={24} className="ml-1" />
            )}
          </button>
        )}

        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleMute}
            className={`text-[#767676] bg-white p-2 rounded-full hover:text-white transition-all shadow-sm ${
              mode === "formal" ? "hover:bg-primary" : "hover:bg-primary2"
            }`}
          >
            {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
          </button>
          {!otherUser && showUpload && (
            <button
              onClick={() => setOpen(true)}
              className={`text-[#767676] bg-white p-2 rounded-full hover:text-white transition-all shadow-sm ${
                mode === "formal" ? "hover:bg-primary" : "hover:bg-primary2"
              }`}
            >
              <MdOutlineUpload size={18} />
            </button>
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={toggleFullScreen}
            className={`text-[#767676] bg-white p-2 rounded-full hover:text-white transition-all shadow-sm ${
              mode === "formal" ? "hover:bg-primary" : "hover:bg-primary2"
            }`}
          >
            {isFullscreen ? (
              <MdFullscreenExit size={18} />
            ) : (
              <MdFullscreen size={18} />
            )}
          </button>
        </div>
      </div>

      <div>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[40] bg-black/10" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl border border-[#BFBFBF] focus:outline-none">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-2xl font-bold">
                  Upload Video M
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-[#767676] hover:text-[#05A9A9] transition-colors p-1">
                    <X className="w-6 h-6" />
                  </button>
                </Dialog.Close>
              </div>

              {videoURL ? (
                <div className="w-full space-y-6">
                  <div className="relative w-full h-[370px] bg-[#BFBFBF] rounded-lg overflow-hidden border border-[#767676]/30">
                    <video
                      src={videoURL}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Choose a file
                        </span>
                      </div>
                    </div>
                  </div>

                  {!selectedFile && (
                    <div className="flex justify-end gap-4">
                      {/* <Button
                        onClick={() => {
                          openFileDialog(), setIsUpdating(true);
                        }}
                        className="bg-[#05A9A9] hover:bg-[#05A9A9]/90 text-white px-6 py-2 rounded-lg transition-all shadow-md"
                      >
                        Update
                      </Button> */}
                      <Button
                        onClick={() => deleteMutation.mutate()}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all shadow-md"
                      >
                        {deleteMutation.isLoading ? <Spinner /> : "Delete"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 bg-[#BFBFBF]/30 border-2 border-dashed border-[#767676] rounded-xl p-8 text-center">
                  <FaFile className="w-16 h-16 text-[#767676] mb-4" />
                  <p className="text-xl text-[#767676] mb-6">
                    No video uploaded
                  </p>
                  <button
                    onClick={openFileDialog}
                    className="bg-[#05A9A9] hover:bg-[#05A9A9]/90 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all transform hover:scale-105 shadow-md"
                  >
                    Select Video File
                  </button>
                </div>
              )}

              {selectedFile && (
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => uploadVideo()}
                    className="bg-[#05A9A9] hover:bg-[#05A9A9]/90 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-md"
                  >
                    {isLoading || isVideoLoading ? <Spinner /> : "Upload Video"}
                  </Button>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
};

export default CustomVideoPlayer;
