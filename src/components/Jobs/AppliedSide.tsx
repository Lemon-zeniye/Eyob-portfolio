import { useNavigate } from "react-router-dom"
import EmptyCard from "../Card/EmptyCard"
import { Button } from "../ui/button"
import JobsCard from "./JobsCard"

const AppliedSide = () => {
  const navigate = useNavigate()
  return (
    <EmptyCard cardClassname=" sm-phone:hidden w-[30%] lg:flex   h-screen overflow-y-scroll ">
      <div className="flex flex-col gap-3 w-full pt-1 px-3">
        <div className="flex flex-row justify-between items-center">
          <p className="opacity-75 font-bold ">Applied Jobs</p>
          <Button
            onClick={() => navigate("/applied-jobs")}
            className="p-0"
            variant={"link"}
          >
            See All
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <JobsCard
            size="small"
            companyName={"Akilo"}
            jobTitle={"AI Engineer"}
            jobDescription={"Desc"}
            location={"Tigray, Mekelle"}
            locationType={"Remote"}
            salary={100000}
            onClick={function (): void {
              throw new Error("Function not implemented.")
            }}
          />
        </div>
      </div>
    </EmptyCard>
  )
}

export default AppliedSide
