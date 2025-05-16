import user from "../../assets/user.jpg";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import ActivityNew from "./ActivityNew";
import {
  deleteUserPicture,
  getCompanyProfile,
  getUserPicture,
  uploadUserPicture,
} from "@/Api/profile.api";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Briefcase,
  Edit,
  Loader,
  Share2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import CustomVideoPlayer from "../Video/Video";
import { UserInfo } from "@/Types/profile.type";
import { getUserFromToken, tos } from "@/lib/utils";
import { Button } from "../ui/button";
import ShareProfile from "./ShareProfile";
import AboutCard from "./AboutCard";
import EmployeeCard from "./EmployeeCard";
import EditCompanyProfile from "./EditCompanyProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CompanyProfileCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [, setUserInfo] = useState<UserInfo | null>(null);
  const { data: userPicture } = useQuery({
    queryKey: ["userPicture"],
    queryFn: getUserPicture,
  });
  const [editProfile, setEditProfile] = useState(false);
  const [shareProfile, setShareProfile] = useState(false);
  const [tempImage, setTempImage] = useState<string>("");
  const [, setActiveTab] = useState("about");

  useEffect(() => {
    if (userPicture?.data) {
      const newImageUrl = `https://awema.co/${userPicture.data.path.replace(
        "public/",
        ""
      )}`;
      setTempImage(newImageUrl);
    } else {
      setTempImage(user);
    }
  }, [userPicture]);

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
      setTempImage(URL.createObjectURL(file)); // Preview
    }
  };

  const { data: companyProfile } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: getCompanyProfile,
  });

  const { mutate, isLoading: uploading } = useMutation({
    mutationFn: uploadUserPicture,
    onSuccess: () => {
      setOpen(false);
      setSelectedFile(null);
      tos.success("Profile uploaded successfully");
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const { mutate: deleteProfilePic, isLoading: isDeleting } = useMutation({
    mutationFn: deleteUserPicture,
    onSuccess: () => {
      setOpen(false);
      setSelectedFile(null);
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("imageFile", selectedFile);
    mutate(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-0">
          <div className="relative">
            <div className="w-full h-48 md:h-64 bg-gradient-to-r from-[#05A9A9] to-[#4ecdc4] rounded-b-[40px]">
              <CustomVideoPlayer />
            </div>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl cursor-pointer hover:opacity-90 transition">
                    <AvatarImage
                      src={tempImage || "/placeholder.svg"}
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#4ecdc4] text-white text-2xl">
                      {companyProfile?.data.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Dialog.Trigger>

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
                        src={tempImage || "/placeholder.svg"}
                        alt="Preview"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#05A9A9] to-[#4ecdc4] text-white text-2xl">
                        {companyProfile?.data?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

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
                    {userPicture?.data?.path && (
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
                      disabled={uploading || !selectedFile}
                      className="gap-2"
                    >
                      {uploading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <>
                          <Upload size={16} /> Upload
                        </>
                      )}
                    </Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <div className="mt-20 px-6 text-center">
            <h2 className="text-2xl font-bold">
              {companyProfile?.data?.name || "User Name"}
            </h2>

            <div className="flex flex-col items-center gap-1 mt-1 text-gray-600">
              <div className="flex items-center gap-1">
                <Briefcase size={14} />
                <span>
                  {" "}
                  {companyProfile?.data.industry ?? "No industry specified"}
                </span>
              </div>

              {/* {userData?.data?.location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{userData.data.location}</span>
              </div>
            )} */}
            </div>

            <p className="mt-3 text-gray-600 max-w-lg mx-auto">
              {companyProfile?.data.companyBio ?? "No Bio"}
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                className="rounded-full px-6 gap-2 border-purple-200 text-primary hover:bg-primary hover:text-white"
                onClick={() => setEditProfile(true)}
              >
                <Edit size={16} /> Edit Profile
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-6 gap-2 border-primary text-primary hover:bg-purple-50 hover:text-primary"
                onClick={() => setShareProfile(true)}
              >
                <Share2 size={16} /> Share
              </Button>
            </div>
          </div>

          <div className="mt-8  px-4 sm:px-6">
            <Tabs
              defaultValue="about"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 w-fit mx-auto  rounded-full bg-gray-100 p-1">
                <TabsTrigger
                  value="about"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="employees"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  Employees
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 pb-8 min-h-[40vh]">
                <TabsContent value="about">
                  <AboutCard />
                </TabsContent>
                <TabsContent value="activity">
                  <ActivityNew />
                </TabsContent>
                <TabsContent value="employees">
                  <EmployeeCard />
                </TabsContent>
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfileCard;
