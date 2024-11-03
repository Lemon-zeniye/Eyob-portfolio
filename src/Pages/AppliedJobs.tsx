import JobsCard from "@/components/Jobs/JobsCard"
import { SearchBar } from "@/components/SearchBar/SearchBar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ListFilter } from "lucide-react"
import { useNavigate } from "react-router-dom"

const AppliedJobs = () => {
  const navigate = useNavigate()

  const desc = `Lorem ipsum dolor sit amet consectetur adipisicing elit. At, dolore!`

  return (
    <div className="flex flex-col gap-6 pr-5">
      <div className="flex sm-phone:flex-col sm:flex-row justify-between sm-phone:gap-8">
        <div className="flex flex-row gap-1 items-center">
          <Button
            onClick={() => navigate(-1)}
            className="p-0 text-primary"
            variant={"ghost"}
          >
            <ChevronLeft size={30} />
          </Button>
          <p className="text-xl font-bold">Applied Jobs</p>
        </div>
        <div className="flex flex-row gap-4 sm-phone:justify-center sm-phone:items-center">
          <SearchBar search="" setSearch={() => {}} />
          <Button>
            <div className="flex flex-row gap-2">
              <ListFilter />
              <p>Filter</p>
            </div>
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-between flex-wrap w-full gap-5">
        <div className="sm:w-[48%] sm-phone:w-full">
          <JobsCard
            size={"large"}
            companyName={"Google"}
            jobTitle={"UI/UX Designer"}
            jobDescription={desc}
            location={"Shire, Tigray"}
            locationType={"Remote"}
            salary={7000}
            onClick={function (): void {
              throw new Error("Function not implemented.")
            }}
            classname="w-full"
          />
        </div>
        <div className="sm:w-[48%] sm-phone:w-full">
          <JobsCard
            size={"large"}
            companyName={"Google"}
            jobTitle={"UI/UX Designer"}
            jobDescription={desc}
            location={"Shire, Tigray"}
            locationType={"Remote"}
            salary={7000}
            onClick={function (): void {
              throw new Error("Function not implemented.")
            }}
            classname="w-full"
          />
        </div>
      </div>
    </div>
  )
}

export default AppliedJobs
