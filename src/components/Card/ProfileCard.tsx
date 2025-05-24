import EmptyCard from "./EmptyCard";
import Tabs from "../Tabs/TabsLine";
import ExperienceCard from "./ExperienceCard";
import EducationCard from "./EducationCard";
import SkillCard from "./SkillCard";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import ActivityNew from "../Profile/ActivityNew";
import {
  deleteUserPicture,
  follow,
  getUserProfile,
  updateUserProfilePic,
  uploadUserPicture,
} from "@/Api/profile.api";
import { Spinner } from "../ui/Spinner";
import * as Dialog from "@radix-ui/react-dialog";
import { Upload, X } from "lucide-react";
import CustomVideoPlayer from "../Video/Video";
import { UserData, UserInfo } from "@/Types/profile.type";
import { formatImageUrl, getUserFromToken, tos } from "@/lib/utils";
import OrganizationCard from "./OrganizationCard";
import { Button } from "../ui/button";
import { IoMdShare } from "react-icons/io";
import EditProfile from "../Profile/EditProfile";
import ShareProfile from "../Profile/ShareProfile";
import Cookies from "js-cookie";
import { getAxiosErrorMessage } from "@/Api/axios";
import { IoPersonAdd } from "react-icons/io5";
import DocumentationCard from "./DocumentationCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCard = ({ otherUser }: { otherUser: UserData | undefined }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [shareProfile, setShareProfile] = useState(false);
  const getOtherUserPic =
    otherUser?.pictures[0]?.path && formatImageUrl(otherUser?.pictures[0].path);
  const [profileImage, setprofileImage] = useState<string | undefined>(
    getOtherUserPic
  );
  const userProfileImg = getOtherUserPic;

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const userData = token && getUserFromToken(token);

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

  const { data: userData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
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

  const { mutate: followUser, isLoading: isFollowLoading } = useMutation({
    mutationFn: follow,
    onSuccess: () => {
      tos.success("Success");
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
        <div className="">
          <div className="w-full">
            <CustomVideoPlayer otherUser={otherUser} />
          </div>
          <div className="relative">
            <div className="absolute   top-1/2 left-5  md:left-10 -translate-y-1/2">
              <Avatar
                className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-xl cursor-pointer hover:opacity-90 transition"
                onClick={() => !otherUser && setOpen(true)}
              >
                <AvatarImage
                  src={profileImage || userProfileImg}
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#4ecdc4] text-white text-xl md:text-2xl">
                  {userInfo?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute z-20 -bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary py-1 rounded-full px-4 text-white whitespace-nowrap text-xs sm:text-sm md:text-base">
                  Open To work
                </div>
              </div>
            </div>
          </div>
          <Dialog.Root open={open} onOpenChange={setOpen}>
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
                    {uploading || updating ? (
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
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold">
                {otherUser?.name ?? userInfo?.name}
              </p>
              <p className="font-extralight">
                {otherUser?.position ??
                  userData?.data?.position ??
                  "No Position specified"}
              </p>
              <p className="font-extralight">
                {otherUser?.location ??
                  userData?.data?.location ??
                  "No Location specified"}
              </p>
              <p className="md:text-base font-extralight">
                {otherUser?.bio ?? userData?.data?.bio ?? "No bio yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 w-full sm-phone:px-0 sm:px-12 ">
        {otherUser ? (
          <Button
            className="border-primary flex items-center gap-2  text-primary hover:text-primary"
            variant="outline"
            onClick={() =>
              followUser({
                followedId: otherUser._id,
              })
            }
          >
            <IoPersonAdd /> {isFollowLoading ? <Spinner /> : "Follow"}
          </Button>
        ) : (
          <Button
            className="border-primary text-primary hover:text-primary"
            variant="outline"
            onClick={() => setEditProfile(true)}
          >
            Edit Profile
          </Button>
        )}
        <Button
          className="flex items-center gap-2 border-primary text-primary hover:text-primary"
          variant="outline"
          onClick={() => setShareProfile(true)}
        >
          {" "}
          <IoMdShare /> Share
        </Button>
      </div>

      <div className="flex flex-row sm-phone:bg-white sm-phone:border sm:border-none sm:bg-none justify-between px-0 sm:px-12 min-h-[40vh]">
        {!otherUser ? (
          <Tabs
            tabs={[
              "Activity",
              "Experience",
              "Education",
              "Skills",
              "Organization",
            ]}
          >
            <ActivityNew />
            <ExperienceCard otherUserExperience={undefined} />
            <EducationCard otherUserEducation={undefined} />
            <SkillCard otherUserSkill={undefined} />
            <OrganizationCard otherUserOrganization={undefined} />
          </Tabs>
        ) : (
          <Tabs
            tabs={[
              "Experience",
              "Education",
              "Skills",
              "Organization",
              "Documentation",
            ]}
          >
            <ExperienceCard otherUserExperience={otherUser?.experience} />
            <EducationCard otherUserEducation={otherUser?.education} />
            <SkillCard otherUserSkill={otherUser?.skills} />
            <OrganizationCard otherUserOrganization={otherUser?.organization} />
            <DocumentationCard
              otherUserCertification={otherUser?.certification}
            />
          </Tabs>
        )}
      </div>

      <Dialog.Root open={editProfile} onOpenChange={setEditProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {userData?.data ? "Edit Profile" : "Add Profile"}
            </Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <EditProfile
              onSuccess={() => setEditProfile(false)}
              initialData={userData?.data}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={shareProfile} onOpenChange={setShareProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Share Profile
            </Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <ShareProfile onSuccess={() => setShareProfile(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </EmptyCard>
  );
};

export default ProfileCard;
