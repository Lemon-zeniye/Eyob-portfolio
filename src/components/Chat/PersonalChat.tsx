import { FC } from "react"
import user from "../../assets/user.jpg"
import { Check, CheckCheck } from "lucide-react"

interface PersonalChatProps {
  imgUrl: string
  name: string
  lastchat: string
  date: string
  seen: boolean
  selected: boolean
  onclick: () => void
}

const PersonalChat: FC<PersonalChatProps> = ({
  imgUrl,
  name,
  date,
  lastchat,
  seen,
  selected,
  onclick,
}) => {
  return (
    <div
      className={`flex flex-row relative justify-between gap-2 items-center py-1 hover:bg-[#fff] cursor-pointer ${
        selected ? "bg-white" : ""
      }  px-2 `}
      onClick={onclick}
    >
      <img className="w-12 h-12 rounded-full" src={user} alt="" />
      <div className="w-3 h-3 absolute left-11 bottom-1 bg-green-500 rounded-full" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-[#7a7a7a]">{lastchat}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs text-[#7a7a7a] ">{date}</p>
        <div className="flex items-end justify-end ">
          {seen ? (
            <Check className="text-primary" size={15} />
          ) : (
            <CheckCheck className="text-primary" size={15} />
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalChat
