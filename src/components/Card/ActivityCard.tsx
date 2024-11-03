import EmptyCard from "./EmptyCard"
import user from "../../assets/user.jpg"
import { PostTypes } from "../Types"

interface ActivityCardProps
  extends Pick<PostTypes, "postContent" | "postDate" | "postTitle"> {
  classname: string
  onclick: () => void
}

function sliceTo168Characters(text: string): string {
  const maxLength = 168
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
}

const ActivityCard = ({
  postContent,
  postDate,
  postTitle,
  classname,
  onclick,
}: ActivityCardProps) => {
  return (
    <EmptyCard
      cardClassname={`px-5 ${classname} `}
      contentClassname="flex flex-row gap-5 py-2"
      onClick={onclick}
    >
      <img
        className="sm:w-32 sm:h-32 sm-phone:w-20 sm-phone:h-20 "
        src={user}
        alt=""
      />
      <div className="flex flex-col w-full gap-3 justify-center">
        <div className="flex flex-row justify-between items-center w-full">
          <p className="text-lg font-semibold">{postTitle}</p>
          <p className="text-sm font-extralight">{postDate}</p>
        </div>

        <p className="text-base font-extralight">
          {sliceTo168Characters(postContent)}
        </p>
      </div>
    </EmptyCard>
  )
}

export default ActivityCard
