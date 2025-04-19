import ActivityCard from "../Card/ActivityCard"
import AddEditButton from "../Card/AddEditButton"
import { PostTypes } from "../Types"

interface ActivityProps {
  posts: PostTypes[]
  addBtn: () => void
  editBtn: (id: string) => void
}

export const ConvertToDate = (date: string): string => {
  const parsedDate = new Date(date)

  const month = parsedDate.getMonth() + 1
  const day = parsedDate.getDate()
  const year = parsedDate.getFullYear().toString().slice(-2)
  const hours = parsedDate.getHours()
  const minutes = parsedDate.getMinutes()

  const formattedDate = `${month}/${day}/${year} ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

  return formattedDate
}
export const ConvertToDateOnly = (date: string | number): string => {
  const parsedDate = new Date(date)

  const month = parsedDate.getMonth() + 1
  const day = parsedDate.getDate()
  const year = parsedDate.getFullYear().toString().slice(-2)

  const formattedDate = `${month}/${day}/${year}`

  return formattedDate
}

const Activity = ({ posts, addBtn, editBtn }: ActivityProps) => {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-row gap-2 justify-end items-end px-2">
        <AddEditButton onclick={addBtn} isEdit={false} />
      </div>
      <div className="flex flex-row flex-wrap gap-4 px-2">
        {posts.map((item, index) => (
          <ActivityCard
            key={item._id}
            onclick={() => editBtn(item._id)}
            classname=" sm-phone:w-full lg:w-[45%]"
            postContent={item.postContent}
            postDate={ConvertToDate(item.postDate)}
            postTitle={item.postTitle}
          />
        ))}
      </div>
    </div>
  )
}

export default Activity
