import type React from "react"
import { useState, useEffect } from "react"
import { useMutation, useQuery } from "react-query"
import Cookies from "js-cookie"
import * as Dialog from "@radix-ui/react-dialog"
import {
  X,
  Upload,
  Trash2,
  Edit,
  Share2,
  MapPin,
  Briefcase,
  Loader,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  deleteUserPicture,
  getUserPicture,
  getUserProfile,
  uploadUserPicture,
} from "@/Api/profile.api"
import { getUserFromToken, tos } from "@/lib/utils"
import type { UserInfo } from "@/Types/profile.type"

import ActivityNew from "../Profile/ActivityNew"
import ExperienceCard from "./ExperienceCard"
import EducationCard from "./EducationCard"
import SkillCard from "./SkillCard"
import OrganizationCard from "./OrganizationCard"
import EditProfile from "../Profile/EditProfile"
import ShareProfile from "../Profile/ShareProfile"
import CustomVideoPlayer from "../Video/Video"

const ProfileCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [editProfile, setEditProfile] = useState(false)
  const [shareProfile, setShareProfile] = useState(false)
  const [tempImage, setTempImage] = useState<string>("")
  const [activeTab, setActiveTab] = useState("activity")

  const { data: userPicture } = useQuery({
    queryKey: ["userPicture"],
    queryFn: getUserPicture,
  })

  const { data: userData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  })

  useEffect(() => {
    if (userPicture?.data) {
      const newImageUrl = `https://awema.co/${userPicture.data.path.replace(
        "public/",
        ""
      )}`
      setTempImage(newImageUrl)
    } else {
      setTempImage("/abstract-profile.png")
    }
  }, [userPicture])

  useEffect(() => {
    const token = Cookies.get("accessToken")
    const userData = token && getUserFromToken(token)

    if (userData) {
      setUserInfo(userData)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setTempImage(URL.createObjectURL(file))
    }
  }

  const { mutate, isLoading: uploading } = useMutation({
    mutationFn: uploadUserPicture,
    onSuccess: () => {
      setOpen(false)
      setSelectedFile(null)
      tos.success("Profile uploaded successfully")
    },
    onError: (error) => {
      console.error("Upload failed", error)
    },
  })

  const { mutate: deleteProfilePic, isLoading: isDeleting } = useMutation({
    mutationFn: deleteUserPicture,
    onSuccess: () => {
      setOpen(false)
      setSelectedFile(null)
    },
    onError: (error) => {
      console.error("Upload failed", error)
    },
  })

  const handleUpload = () => {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append("imageFile", selectedFile)
    mutate(formData)
  }

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
                      {userInfo?.name?.charAt(0) || "U"}
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
                        {userInfo?.name?.charAt(0) || "U"}
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
              {userInfo?.name || "User Name"}
            </h2>

            <div className="flex flex-col items-center gap-1 mt-1 text-gray-600">
              {userData?.data?.position && (
                <div className="flex items-center gap-1">
                  <Briefcase size={14} />
                  <span>{userData.data.position}</span>
                </div>
              )}

              {userData?.data?.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{userData.data.location}</span>
                </div>
              )}
            </div>

            {userData?.data?.bio && (
              <p className="mt-3 text-gray-600 max-w-lg mx-auto">
                {userData.data.bio}
              </p>
            )}

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

          <div className="mt-8 px-4 sm:px-6">
            <Tabs
              defaultValue="activity"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-5 w-full rounded-full bg-gray-100 p-1">
                <TabsTrigger
                  value="activity"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger
                  value="organization"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  Organization
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 pb-8 min-h-[40vh]">
                <TabsContent value="activity">
                  <ActivityNew />
                </TabsContent>
                <TabsContent value="experience">
                  <ExperienceCard />
                </TabsContent>
                <TabsContent value="education">
                  <EducationCard />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillCard />
                </TabsContent>
                <TabsContent value="organization">
                  <OrganizationCard />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Dialog.Root open={editProfile} onOpenChange={setEditProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg flex flex-col gap-6">
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
            <EditProfile
              onSuccess={() => setEditProfile(false)}
              initialData={userData?.data}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={shareProfile} onOpenChange={setShareProfile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg flex flex-col gap-6">
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
  )
}

export default ProfileCard
