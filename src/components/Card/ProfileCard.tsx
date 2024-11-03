import EmptyCard from "./EmptyCard"
// import sampleVideo from "../../assets/WhatsApp Video 2024-05-30 at 01.30.45.mp4"
// import VideoPlayer from "../Video/VideoJs"
import user from "../../assets/user.jpg"
import Tabs from "../Tabs/TabsLine"
import Activity from "../Profile/Activity"
import ExperienceCard from "./ExperienceCard"
import EducationCard from "./EducationCard"
import SkillCard from "./SkillCard"
import { useUser } from "@/Context/UserContext"
import { useState } from "react"
import ActivityModal from "../Modal/ActivityModal"

const ProfileCard = () => {
  const { education, experience, posts, skills } = useUser()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isEditMode, setEditMode] = useState(false)
  const [currentPost, setCurrentPost] = useState<{
    title: string
    desc: string
  } | null>(null)

  const handleOpenForNewPost = () => {
    setEditMode(false)
    setOpenModal(true)
  }

  const handleOpenForEdit = (title: string, desc: string) => {
    setCurrentPost(null)
    setEditMode(true)
    setCurrentPost({ title, desc })
    setOpenModal(true)
  }

  console.log("Current Post", currentPost)

  const handleSubmit = (data: { title: string; desc: string }) => {
    if (isEditMode) {
      console.log("Updating post:", data)
    } else {
      console.log("Creating new post:", data)
    }
    setOpenModal(false)
  }

  return (
    <EmptyCard
      cardClassname="lg:w-3/4 pb-10 sm-phone:bg-transparent sm-phone:border-none sm:border sm:bg-white sm-phone:w-full overflow-y-scroll "
      contentClassname="flex flex-col gap-20"
    >
      <div className="relative   ">
        <div className=" w-full h-[35vh]">video-holder</div>
        {/* <VideoPlayer src={sampleVideo} type={"video/mp4"} /> */}
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
              UI/UX Designer, <strong>Industry</strong>
            </p>
          </div>
        </div>
        <p className=" md:text-base lg:text-lg font-extralight">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non,
          nostrum. Consequatur laudantium earum officia quam natus deserunt at
          beatae eos. dolor sit amet consectetur adipisicing elit. Non, nostrum.
          Consequatur laudantium earum officia quam natus deserunt at beatae
          eos. dolor sit amet consectetur adipisicing elit. Non, nostrum.
          Consequatur laudantium earum officia quam natus deserunt at beatae
          eos.{" "}
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
            editBtn={() =>
              handleOpenForEdit(
                "Hey",
                "HHHHHEEEEEYYYY"
                // currentPost?.title ?? "",
                // currentPost?.desc ?? ""
              )
            }
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
