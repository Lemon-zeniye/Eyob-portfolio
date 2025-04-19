import { Video as Video__ } from "reactjs-media"
import video from "../../assets/Vid.mp4"

const Video = () => {
  return (
    <div className="bg-red-400">
      <Video__
        height={340}
        width={1350}
        src={video}
        poster="/poster.png"
        controls={true}
      />
    </div>
  )
}

export default Video
