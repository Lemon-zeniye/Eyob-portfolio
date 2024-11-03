import EmptyCard from "./EmptyCard"
import user from "../../assets/user.jpg"

interface ExpAndEduCardProps {
  title?: string
  institution?: string
  date?: string
  location?: string
  isNotSkills?: boolean
  onClick?: () => void
}

const ExpAndEduCard = ({
  date,
  institution,
  location,
  title,
  isNotSkills,
  onClick,
}: ExpAndEduCardProps) => {
  return (
    <EmptyCard
      onClick={onClick}
      cardClassname="px-5"
      contentClassname="flex flex-row gap-5 py-2"
    >
      <img
        className={` ${
          isNotSkills
            ? "sm:w-32 sm:h-32 sm-phone:w-20 sm-phone:h-20"
            : "w-12 h-12"
        } `}
        src={user}
        alt=""
      />
      <div className="flex flex-col gap-2 justify-center ">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-base font-normal opacity-50">{institution}</p>
        </div>
        {isNotSkills ? (
          <div>
            <p className="text-sm font-extralight">{date}</p>
            <p className="text-xs font-normal opacity-50">{location}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </EmptyCard>
  )
}

export default ExpAndEduCard
