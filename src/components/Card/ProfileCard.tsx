import EmptyCard from "./EmptyCard"
import user from "../../assets/user.jpg"
import Tabs from "../Tabs/TabsLine"
import Activity from "../Profile/Activity"
import ExperienceCard from "./ExperienceCard"
import EducationCard from "./EducationCard"
import SkillCard from "./SkillCard"
import { useUser } from "@/Context/UserContext"
import { useState } from "react"
import ActivityModal from "../Modal/ActivityModal"
import Video from "../Video/Video"
// import { post_ } from "@/Api/api"

const ProfileCard = () => {
  const { education, experience, posts, skills, profile } = useUser()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isEditMode, setEditMode] = useState(false)
  const [currentPost, setCurrentPost] = useState<{
    postTitle: string
    postContent: string
  } | null>(null)

  const handleOpenForNewPost = () => {
    setEditMode(false)
    setOpenModal(true)
  }

  const filterPost = (id: string) => {
    posts.filter((_id) =>
      _id._id === id
        ? setCurrentPost({
            postTitle: _id.postTitle,
            postContent: _id.postContent,
          })
        : ""
    )
  }

  const handleOpenForEdit = (id: string) => {
    filterPost(id)
    setEditMode(true)
    setOpenModal(true)
  }

  console.log("Posts", posts)

  const handleSubmit = async (data: {
    postTitle: string
    postContent: string
  }) => {
    if (isEditMode) {
      console.log("Updating post:", data)
    } else {
      const data_ = { ...data, postImages: [] }
      console.log("Creating new post:", data)
      // const response = await post_("userPost/postContent", data_)
      console.log(response)
    }
    setOpenModal(false)
    setCurrentPost(null)
    setEditMode(false)
  }

  return (
    <EmptyCard
      cardClassname="lg:w-3/4 pb-10 sm-phone:bg-transparent sm-phone:border-none sm:border sm:bg-white sm-phone:w-full overflow-y-scroll "
      contentClassname="flex flex-col gap-20"
    >
      <div className="relative   ">
        <div className=" w-full ">
          <Video />
        </div>
        <img
          className=" sm-phone:w-20 sm-phone:h-20 sm:w-36 sm:h-36 rounded-full absolute -bottom-16 sm:left-12 sm-phone:left-8 "
          src={user}
          alt=""
        />
      </div>
      <div className="w-full sm-phone:px-0 sm:px-12 flex flex-col gap-6">
        <div className="w-full px-2 flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold">John Wick</p>
            <p className="text-lg font-extralight">
              {profile?.position || "No Position"}, <strong>Industry</strong>
            </p>
          </div>
        </div>
        <p className=" md:text-base lg:text-lg font-extralight">
          {profile?.bio || "No Bio Available"}
          <strong
            onClick={() => setOpenModal(true)}
            className="font-bold text-primary"
          >
            See More
          </strong>
        </p>
      </div>
      <div className="flex flex-row sm-phone:bg-white sm-phone:border sm:border-none sm:bg-none justify-between sm-phone:px-0 sm:px-12">
        <Tabs tabs={["Activity", "Experience", "Education", "Skills"]}>
          <Activity
            addBtn={() => handleOpenForNewPost()}
            editBtn={handleOpenForEdit}
            posts={posts}
          />
          <ExperienceCard experiences={experience} />
          <EducationCard education={education} />
          <SkillCard skills={skills} />
        </Tabs>
      </div>
      <ActivityModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Create Post"
        onSubmit={handleSubmit}
        initialData={currentPost || undefined}
        isEditMode={isEditMode}
      />
    </EmptyCard>
  )
}

export default ProfileCard
