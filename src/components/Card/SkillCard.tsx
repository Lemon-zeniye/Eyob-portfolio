import AddEditButton from "./AddEditButton"
import ExpAndEduCard from "./ExpAndEduCard"

interface SkillCardProps {
  skills: string[]
}

const SkillCard = ({ skills }: SkillCardProps) => {
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
        {skills.map((item, index) => (
          <ExpAndEduCard
            key={index}
            isNotSkills={false}
            title={item}
            institution="Company"
          />
        ))}
      </div>
    </div>
  )
}

export default SkillCard
