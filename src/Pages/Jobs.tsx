import { fetchJobs } from "@/Api/api"
import AppliedSide from "@/components/Jobs/AppliedSide"
import { CheckboxWithLabel } from "@/components/Jobs/CheckBox"
import JobsCard from "@/components/Jobs/JobsCard"
import JobsDetail from "@/components/Jobs/JobsDetail"
import JobsFilterSm from "@/components/Jobs/JobsFilterSm"
import { SearchBar } from "@/components/SearchBar/SearchBar"
import { Button } from "@/components/ui/button"
import { ExternalLink, Frown, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface AppliedButtonProps {
  classname: string
  onClick: () => void
}

type JobsCardty = {
  company: string
  jobTitle: string
  jobDescription: string
  location: string
  locationType: string
  salary: number
}

const AppliedButton = ({ classname, onClick }: AppliedButtonProps) => (
  <Button
    onClick={onClick}
    variant={"link"}
    className={`${classname} flex flex-row gap-2 text-center `}
  >
    <ExternalLink size={20} />
    Applied Jobs
  </Button>
)

const filterValues = [
  {
    category: "Degree",
    options: [
      { id: 1, name: "Associate degree", value: "associate-degree" },
      { id: 2, name: "Bachelor Degree", value: "bachelor-degree" },
      { id: 3, name: "Masters Degree", value: "masters-degree" },
      { id: 4, name: "Doctorate Degree", value: "doctorate-degree" },
    ],
  },
  {
    category: "Years Of Experience",
    options: [
      { id: 1, name: "0 - 3 years", value: "0-3-years" },
      { id: 2, name: "3 - 5 years", value: "3-5-years" },
      { id: 3, name: "5 - 10 years", value: "5-10-years" },
      { id: 4, name: "10 + years", value: "10-plus-years" },
    ],
  },
  {
    category: "Job Type",
    options: [
      { id: 1, name: "Full Time", value: "full-time" },
      { id: 2, name: "Part Time", value: "part-time" },
      { id: 3, name: "Internship", value: "internship" },
      { id: 4, name: "Contract", value: "contract" },
    ],
  },
  {
    category: "Job Location",
    options: [
      { id: 1, name: "Remote", value: "remote" },
      { id: 2, name: "On site", value: "on-site" },
      { id: 3, name: "Hybrid", value: "hybrid" },
    ],
  },
]

const Jobs = () => {
  const [jobs, setJobs] = useState<JobsCardty[]>([])
  const [search, setSearch] = useState<string>("")
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [openJobDetail, setOpenJobDetail] = useState<boolean>(false)

  useEffect(() => {
    const getJobs = async () => {
      try {
        const jobsData = await fetchJobs()
        setJobs(jobsData.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getJobs()
  }, [])

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setSelectedValues((prevValues) =>
      checked ? [...prevValues, value] : prevValues.filter((v) => v !== value)
    )
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesFilters =
      selectedValues.length === 0 ||
      selectedValues.some((filter) => {
        return (
          filter === job.locationType?.toLowerCase() ||
          filter === job.jobTitle?.toLowerCase() ||
          filter === job.company?.toLowerCase()
        )
      })

    const matchesSearch =
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase()) ||
      job.locationType?.toLowerCase().includes(search.toLowerCase())

    return matchesFilters && matchesSearch
  })

  console.log("DETAIL: ", openJobDetail)

  return (
    <div className="flex flex-col gap-5 pr-5">
      <div className="flex flex-row justify-between items-center">
        <p className=" sm:text-base md:text-xl font-bold">
          Recommended For You
        </p>
        <div className="flex flex-row sm-phone:gap-2">
          <div className="sm-phone:hidden sm:flex">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className="lg:hidden sm:flex sm-phone:hidden ">
            <JobsFilterSm
              filterValues={filterValues}
              selectedValues={selectedValues}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
          <AppliedButton
            classname=" sm:hidden sm-phone:flex "
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex sm-phone:flex-row sm-phone:justify-between sm:items-end sm:justify-end">
          <div className="flex flex-row sm-phone:items-end justify-end w-full sm:hidden sm-phone:gap-2">
            <SearchBar search={search} setSearch={setSearch} />
            <JobsFilterSm
              filterValues={filterValues}
              selectedValues={selectedValues}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
          <AppliedButton
            classname=" sm:flex sm-phone:hidden lg:hidden"
            onClick={() => {}}
          />
        </div>
        <div className="flex flex-row justify-between w-full gap-6">
          <div className=" sm-phone:hidden lg:flex flex-col gap-7 w-1/5">
            <div className="flex flex-col gap-3 w-full">
              {filterValues.map((filter) => (
                <div key={filter.category} className="flex flex-col gap-3">
                  <p className="font-medium">{filter.category}</p>
                  <div className="flex flex-col gap-4">
                    {filter.options.map((option) => (
                      <CheckboxWithLabel
                        key={option.id}
                        id={option.value}
                        label={option.name}
                        onChange={(checked) =>
                          handleCheckboxChange(option.value, checked)
                        }
                        checked={selectedValues.includes(option.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:w-2/3">
            {loading ? (
              <div className="flex items-center justify-center h-full ">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col w-full gap-3 items-center justify-center h-full ">
                <Frown size={80} className="text-primary" />
                <p className="font-bold text-center ">
                  Sorry, but we don't have those jobs for you!
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobsCard
                  key={job.jobTitle}
                  size="large"
                  companyName={job.company}
                  jobTitle={job.jobTitle}
                  jobDescription={job.jobDescription}
                  location={job.location}
                  locationType={job.locationType}
                  salary={job.salary}
                  onClick={() => setOpenJobDetail(true)}
                />
              ))
            )}
          </div>

          <AppliedSide />
        </div>
        <JobsDetail
          open={openJobDetail}
          onChange={(isOpen) => setOpenJobDetail(isOpen)}
        />
      </div>
    </div>
  )
}

export default Jobs
