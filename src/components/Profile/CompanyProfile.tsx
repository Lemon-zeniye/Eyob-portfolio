import EmptyCard from "../Card/EmptyCard";
import Tabs from "../Tabs/TabsLine";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import ActivityNew from "./ActivityNew";
import {
  deleteUserPicture,
  getCompanyProfile,
  updateUserProfilePic,
  uploadUserPicture,
} from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import * as Dialog from "@radix-ui/react-dialog";
import { Upload, X } from "lucide-react";
import CustomVideoPlayer from "../Video/Video";
import { UserInfo } from "@/Types/profile.type";
import { getUserFromToken, tos } from "@/lib/utils";
import { Button } from "../ui/button";
import { IoMdShare } from "react-icons/io";
import ShareProfile from "./ShareProfile";
import AboutCard from "./AboutCard";
import EmployeeCard from "./EmployeeCard";
import EditCompanyProfile from "./EditCompanyProfile";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAxiosErrorMessage } from "@/Api/axios";

const CompanyProfileCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [, setUserInfo] = useState<UserInfo | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [shareProfile, setShareProfile] = useState(false);
  const userProfileImg = Cookies.get("profilePic");
  const [profileImage, setprofileImage] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = getUserFromToken(token);

    if (userData) {
      setUserInfo(userData);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setprofileImage(URL.createObjectURL(file)); // Preview
    }
  };

  const { data: companyProfile } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: getCompanyProfile,
  });

  const { mutate, isLoading: uploading } = useMutation({
    mutationFn: uploadUserPicture,
    onSuccess: (res) => {
      setOpen(false);
      setSelectedFile(null);
      tos.success("Profile uploaded successfully");
      const newImageUrl = `https://awema.co/${res?.data.path.replace(
        "public/",
        ""
      )}`;
      Cookies.set("profilePic", newImageUrl);
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error);
      tos.error(msg);
    },
  });

  const { mutate: updateProfilePic, isLoading: updating } = useMutation({
    mutationFn: updateUserProfilePic,
    onSuccess: (res) => {
      setOpen(false);
      setSelectedFile(null);
      tos.success("Profile updated successfully");
      const newImageUrl = `https://awema.co/${res?.data.path.replace(
        "public/",
        ""
      )}`;
      Cookies.set("profilePic", newImageUrl);
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error);
      tos.error(msg);
    },
  });

  const { mutate: deleteProfilePic, isLoading: isDeleting } = useMutation({
    mutationFn: deleteUserPicture,
    onSuccess: () => {
      setOpen(false);
      setSelectedFile(null);
      Cookies.remove("profilePic");
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error);
      tos.error(msg);
    },
  });

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("imageFile", selectedFile);
    if (userProfileImg) {
      updateProfilePic(formData);
    } else {
      mutate(formData);
    }
  };

  return (
    <EmptyCard
      cardClassname="lg:w-3/4 pb-10 sm-phone:bg-transparent sm-phone:border-none sm:border sm:bg-white sm-phone:w-full overflow-y-scroll "
      contentClassname="space-y-4"
    >
      <div className="flex flex-col gap-20">
        <div className="relative">
          <div className="w-full">
            <CustomVideoPlayer otherUser={undefined} />
          </div>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Avatar className="z-50 w-20 h-20 sm:w-36 sm:h-36 rounded-full absolute -bottom-16 sm:left-12 left-8 border-4 border-primary shadow-lg cursor-pointer hover:brightness-90 object-cover transition">
                <AvatarImage
                  src={profileImage || userProfileImg}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#4ecdc4] text-white text-2xl">
                  {companyProfile?.data.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
                <div className="flex justify-between items-center mb-2">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Update Profile Picture
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-gray-400 hover:text-gray-600 transition">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <img
                    src={profileImage}
                    alt="Preview"
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-primary shadow-md object-cover"
                  />
                  <label className="w-full">
                    <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Choose a file or drag & drop
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  {userProfileImg && (
                    <button
                      onClick={() => deleteProfilePic()}
                      className="px-4 py-2 text-sm rounded-md border text-white bg-red-500 hover:bg-red-500/90 transition"
                    >
                      {isDeleting ? <Spinner /> : " Delete"}
                    </button>
                  )}
                  <button
                    onClick={handleUpload}
                    disabled={uploading || updating || !selectedFile}
                    className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {uploading ? (
                      <Spinner />
                    ) : userProfileImg ? (
                      "Update"
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="w-full sm-phone:px-0 sm:px-12 flex flex-col">
          <div className="w-full px-2 flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">{companyProfile?.data.name}</p>
              <p className="font-extralight">
                {companyProfile?.data.industry ?? "No industry specified"}
              </p>
              <p className="md:text-base font-extralight">
                {companyProfile?.data.companyBio ?? "No Bio"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 w-full sm-phone:px-0 sm:px-12 ">
        <Button
          className="border-primary text-primary hover:text-primary"
          variant="outline"
          onClick={() => setEditProfile(true)}
        >
          Edit Profile
        </Button>
        <Button
          className="flex items-center gap-2 border-primary text-primary hover:text-primary"
          variant="outline"
          onClick={() => setShareProfile(true)}
        >
          {" "}
          <IoMdShare /> Share
        </Button>
      </div>

      <div className="flex flex-row sm-phone:bg-white sm-phone:border sm:border-none sm:bg-none justify-between sm-phone:px-0 sm:px-12 min-h-[40vh]">
        <Tabs tabs={["About", "Activity", "Employees"]}>
          <AboutCard />
          <ActivityNew />
          <EmployeeCard />
        </Tabs>
      </div>

      <Dialog.Root open={editProfile} onOpenChange={setEditProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[60%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Edit Profile
            </Dialog.Title>
            <EditCompanyProfile
              initialValue={companyProfile?.data}
              onSuccess={() => setEditProfile(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={shareProfile} onOpenChange={setShareProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[60%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Share Profile
            </Dialog.Title>
            <ShareProfile onSuccess={() => setEditProfile(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </EmptyCard>
  );
};

export default CompanyProfileCard;
