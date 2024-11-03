import { ConvertToDateOnly } from "../Profile/Activity"
import { UserExperience } from "../Types"
import AddEditButton from "./AddEditButton"
import ExpAndEduCard from "./ExpAndEduCard"

interface ExperienceCardProps {
  experiences: UserExperience[]
}

const ExperienceCard = ({ experiences }: ExperienceCardProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-2 justify-end items-end px-2">
        <AddEditButton
          onclick={function (): void {
            throw new Error("Function not implemented.")
          }}
          isEdit={true}
        />
        <AddEditButton
          onclick={function (): void {
            throw new Error("Function not implemented.")
          }}
          isEdit={false}
        />
      </div>
      <div className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-10 px-2">
        {experiences.map((item, index) => (
          <ExpAndEduCard
            key={index}
            institution={item.entity}
            date={`${ConvertToDateOnly(item.startDate)} - ${ConvertToDateOnly(
              item.endDate
            )}`}
            location={item.location}
            title={item.jobTitle}
            isNotSkills
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  )
}

export default ExperienceCard
