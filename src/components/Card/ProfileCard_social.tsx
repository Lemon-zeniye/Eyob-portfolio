import type React from "react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import Cookies from "js-cookie";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Upload,
  Trash2,
  Edit,
  Share2,
  // MapPin,
  // Briefcase,
  Loader,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  deleteUserPicture,
  follow,
  getPersonalInfo,
  getUserProfile,
  updateUserProfilePic,
  uploadUserPicture,
} from "@/Api/profile.api";
import { formatImageUrl, getUserFromToken, tos } from "@/lib/utils";
import type { UserData, UserInfo, UserProfile } from "@/Types/profile.type";

import ActivityNew from "../Profile/ActivityNew";
import ExperienceCard from "./ExperienceCard";
import EducationCard from "./EducationCard";
import SkillCard from "./SkillCard";
import OrganizationCard from "./OrganizationCard";
import ShareProfile from "../Profile/ShareProfile";
import CustomVideoPlayer from "../Video/Video";
import { getAxiosErrorMessage } from "@/Api/axios";
import { FaUserPlus } from "react-icons/fa";
import { Spinner } from "../ui/Spinner";
import DocumentationCard from "./DocumentationCard";
import { useRole } from "@/Context/RoleContext";
import { ProfileTab } from "../Profile/ProfileTab";

const ProfileCard = ({
  otherUser,
  isOtherUser,
  userProfile,
}: {
  otherUser: UserData | undefined;
  isOtherUser: boolean;
  userProfile?: UserProfile | undefined;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [shareProfile, setShareProfile] = useState(false);
  // const getOtherUserPic = otherUser
  //   ? otherUser?.pictures[0]?.path &&
  //     formatImageUrl(otherUser?.pictures[0].path)
  //   : Cookies.get("profilePic");
  const [profileImage, setprofileImage] = useState<string | undefined>(
    undefined
  );
  const { mode } = useRole();

  const userProfileImg = Cookies.get("profilePic");

  const [activeTab, setActiveTab] = useState(
    !otherUser ? "activity" : "experience"
  );

  const { data: userData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: !isOtherUser,
  });

  const { data: personalInfo } = useQuery({
    queryKey: ["personalInfo"],
    queryFn: getPersonalInfo,
    enabled: !isOtherUser,
  });

  useEffect(() => {
    if (otherUser?.pictures[0]?.path && isOtherUser) {
      setprofileImage(formatImageUrl(otherUser.pictures[0].path));
    } else if (!isOtherUser) {
      setprofileImage(Cookies.get("profilePic"));
    } else {
      setprofileImage(undefined);
    }
  }, [otherUser]);

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
      setprofileImage(URL.createObjectURL(file));
    }
  };

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

  console.log("33333333", userProfile);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-0">
          <div className="">
            <div className="w-full relative bg-gradient-to-r from-[#05A9A9] to-[#4ecdc4] rounded-b-[40px]">
              <CustomVideoPlayer
                otherUser={otherUser}
                isOtherUser={isOtherUser}
              />

              {/* Avatar positioned at bottom center */}
              <div className="absolute  bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                {/* <Dialog.Trigger asChild> */}
                <Avatar
                  className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-xl cursor-pointer hover:opacity-90 transition"
                  onClick={() => !isOtherUser && setOpen(true)}
                >
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#4ecdc4] text-white text-xl md:text-2xl">
                    {userInfo?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Dialog.Root open={open} onOpenChange={setOpen}>
                  {/* </Dialog.Trigger> */}
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg flex flex-col gap-6">
                      <div className="flex justify-between items-center mb-2">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          Update Profile Picture
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100">
                            <X size={20} />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-36 h-36 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={profileImage || "/placeholder.svg"}
                            alt="Preview"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#4ecdc4] text-white text-2xl">
                            {userInfo?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <label className="w-full">
                          <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
                            <div className="flex flex-col items-center gap-2">
                              <Upload size={24} className="text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Choose a file
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
                          <Button
                            onClick={() => deleteProfilePic()}
                            variant="destructive"
                            className="gap-2"
                          >
                            {isDeleting ? (
                              <Loader className="animate-spin" />
                            ) : (
                              <>
                                <Trash2 size={16} /> Delete
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          onClick={handleUpload}
                          disabled={uploading || updating || !selectedFile}
                          className="gap-2"
                        >
                          {uploading || updating ? (
                            <Loader className="animate-spin" />
                          ) : (
                            <>
                              <Upload size={16} />{" "}
                              {userProfileImg ? "Update" : "Upload"}
                            </>
                          )}
                        </Button>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
                <div
                  className={`py-1 w-[9rem] text-center rounded-full px-4 z-20 text-white absolute left-1/2 -bottom-1/3  md:-bottom-1/4  -translate-x-1/2 -translate-y-1/2  ${
                    mode === "formal" ? "bg-primary" : "bg-primary2"
                  }
               `}
                >
                  Open To work
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 md:mt-20 px-6 text-center">
            <h2 className="text-2xl font-bold">
              {otherUser?.name ?? userInfo?.name}
            </h2>

            <div className="flex flex-col gap-1">
              <p className="font-extralight">
                {userProfile?.position ??
                  userData?.data?.position ??
                  "No Position specified"}
              </p>
              <p className="font-extralight">
                {userProfile?.location ??
                  userData?.data?.location ??
                  "No Location specified"}
              </p>
              <p className="md:text-base font-extralight">
                {userProfile?.bio ?? userData?.data?.bio ?? "No bio yet"}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              {!otherUser ? (
                <Button
                  variant="outline"
                  className={`rounded-full px-6 gap-2 border-purple-200  hover:text-white ${
                    mode === "formal"
                      ? "text-primary hover:bg-primary"
                      : "text-primary2 hover:bg-primary2"
                  }`}
                  onClick={() => setEditProfile(true)}
                >
                  <Edit size={16} /> Edit Profile
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className={`rounded-full px-6 gap-2 border-purple-200  hover:text-white ${
                    mode === "formal"
                      ? "text-primary hover:bg-primary"
                      : "text-primary2 hover:bg-primary2"
                  }`}
                  onClick={() =>
                    followUser({
                      followedId: otherUser._id,
                    })
                  }
                >
                  <FaUserPlus size={16} />{" "}
                  {isFollowLoading ? <Spinner /> : "Follow"}
                </Button>
              )}
              <Button
                variant="outline"
                className={`rounded-full px-6 gap-2 border-purple-200  hover:text-white ${
                  mode === "formal"
                    ? "text-primary hover:bg-primary"
                    : "text-primary2 hover:bg-primary2"
                }`}
                onClick={() => setShareProfile(true)}
              >
                <Share2 size={16} /> Share
              </Button>
            </div>
          </div>

          <div className="mt-8 px-4 sm:px-6">
            <Tabs
              defaultValue={!otherUser ? "activity" : "experience"}
              value={activeTab}
              className="w-full"
              onValueChange={setActiveTab}
            >
              {/* Scrollable container for mobile */}
              <div className="relative">
                <TabsList className="flex w-full justify-around overflow-x-auto items-center md:flex md:rounded-full bg-gray-100 overflow-y-hidden">
                  {!otherUser && (
                    <TabsTrigger
                      value="activity"
                      className="whitespace-nowrap rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-primary flex-shrink-0 md:flex-shrink"
                    >
                      Activity
                    </TabsTrigger>
                  )}
                  <TabsTrigger
                    value="experience"
                    className="whitespace-nowrap rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-primary flex-shrink-0 md:flex-shrink"
                  >
                    Experience
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="whitespace-nowrap rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-primary flex-shrink-0 md:flex-shrink"
                  >
                    Education
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="whitespace-nowrap rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-primary flex-shrink-0 md:flex-shrink"
                  >
                    Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="organization"
                    className="whitespace-nowrap rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-primary flex-shrink-0 md:flex-shrink"
                  >
                    Organization
                  </TabsTrigger>
                  {otherUser && (
                    <TabsTrigger
                      value="documentation"
                      className="whitespace-nowrap rounded-full px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-primary flex-shrink-0 md:flex-shrink"
                    >
                      Documentation
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="mt-6 pb-8 min-h-[40vh]">
                {!otherUser && (
                  <TabsContent value="activity">
                    <ActivityNew />
                  </TabsContent>
                )}
                <TabsContent value="experience">
                  <ExperienceCard otherUserExperience={otherUser?.experience} />
                </TabsContent>
                <TabsContent value="education">
                  <EducationCard otherUserEducation={otherUser?.education} />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillCard otherUserSkill={otherUser?.skills} />
                </TabsContent>
                <TabsContent value="organization">
                  <OrganizationCard
                    otherUserOrganization={otherUser?.organization}
                  />
                </TabsContent>
                {otherUser && (
                  <TabsContent value="documentation">
                    <DocumentationCard
                      otherUserCertification={otherUser?.certification}
                    />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Dialog.Root open={editProfile} onOpenChange={setEditProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {userData?.data ? "Edit Profile" : "Add Profile"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
            <ProfileTab
              profileInitialData={userData?.data}
              personalInfoInitialData={personalInfo?.data}
              onSuccess={() => setEditProfile(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={shareProfile} onOpenChange={setShareProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[96%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Share Profile
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
            <ShareProfile onSuccess={() => setShareProfile(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ProfileCard;
