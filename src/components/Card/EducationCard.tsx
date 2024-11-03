import { ConvertToDateOnly } from "../Profile/Activity"
import { UserEducation } from "../Types"
import AddEditButton from "./AddEditButton"
import ExpAndEduCard from "./ExpAndEduCard"

interface EducationCardProps {
  education: UserEducation[]
}

const EducationCard = ({ education }: EducationCardProps) => {
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
        {education.map((item, index) => (
          <ExpAndEduCard
            key={index}
            institution={item.institution}
            date={`${ConvertToDateOnly(item.graduationYear)}`}
            location={""}
            title={item.degree}
            isNotSkills
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  )
}

export default EducationCard
