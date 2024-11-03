// import * as React from "react"
// import videojs from "video.js"
// import "video.js/dist/video-js.css"

// interface IVideoPlayerProps {
//   src: string
//   type: string
// }

// const initialOptions: videojs.PlayerOptions = {
//   controls: true,
//   fluid: true,
//   controlBar: {
//     volumePanel: {
//       inline: false,
//     },
//   },
// }

// const VideoPlayer: React.FC<IVideoPlayerProps> = ({ src, type }) => {
//   const videoNode = React.useRef<HTMLVideoElement | null>(null)
//   const player = React.useRef<videojs.Player | null>(null)

//   React.useEffect(() => {
//     if (videoNode.current) {
//       player.current = videojs(videoNode.current, {
//         ...initialOptions,
//         sources: [{ src, type }],
//       }).ready(function () {})
//     }

//     return () => {
//       if (player.current) {
//         player.current.dispose()
//         player.current = null
//       }
//     }
//   }, [src, type])

//   return (
//     <div className="video-wrapper">
//       <video ref={videoNode} className="video-js" />
//     </div>
//   )
// }

// export default VideoPlayer

const VideoJs = () => {
  return <div>VideoJs</div>
}

export default VideoJs
