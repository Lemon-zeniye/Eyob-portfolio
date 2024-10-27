import EmptyCard from "./EmptyCard"
import sampleVideo from "../../assets/WhatsApp Video 2024-05-30 at 01.30.45.mp4"
import VideoPlayer from "../Video/VideoJs"

const ProfileCard = () => {
  return (
    <EmptyCard cardClassname="w-3/4">
      <div className="video-container">
        <VideoPlayer src={sampleVideo} type={"video/mp4"} />
      </div>
    </EmptyCard>
  )
}

export default ProfileCard
