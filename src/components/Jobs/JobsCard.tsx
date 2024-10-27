import EmptyCard from "../Card/EmptyCard"
import logo from "../../assets/icons8-google-48.png"
import { Briefcase, CircleDollarSign, Heart, MapPin } from "lucide-react"

interface JobsCardProps {
  size: "small" | "large"
  companyName: string
  jobTitle: string
  jobDescription: string
  location: string
  locationType: string
  salary: number
  onClick: () => void
}

const JobsCard = ({
  size,
  companyName,
  jobDescription,
  jobTitle,
  location,
  locationType,
  salary,
  onClick,
}: JobsCardProps) => {
  const isSmall = size === "small"
  return (
    <div>
      <EmptyCard cardClassname={`${isSmall ? "bg-[#f5f5f5]" : ""} `}>
        <div
          onClick={onClick}
          className="flex flex-col gap-4 pt-4 px-4 cursor-pointer"
        >
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
              <img
                className={` ${isSmall ? "w-12 h-12" : "w-16 h-16"}  `}
                src={logo}
                alt=""
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {companyName ?? "Company Name"}
                </p>
                <p className={` ${isSmall ? "text-sm" : ""} font-bold `}>
                  {jobTitle ?? "Job Title"}
                </p>
              </div>
            </div>
            <div>
              <Heart size={isSmall ? 24 : 25} />
            </div>
          </div>
          <div className="w-full">
            <p
              className={` ${
                isSmall ? "text-sm" : "text-base"
              } font-light opacity-75`}
            >
              {jobDescription ?? "job description"}
            </p>
          </div>
          <div className="w-full flex opacity-75 flex-row justify-between gap-5 flex-wrap">
            <div className="flex flex-row gap-2 items-center">
              <MapPin size={isSmall ? 22 : 25} />{" "}
              <p className={`${isSmall ? "text-sm" : "text-base"}`}>
                {location ?? "Location"}
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Briefcase size={isSmall ? 22 : 25} />{" "}
              <p className={`${isSmall ? "text-sm" : "text-base"}`}>
                {locationType ?? "Not Specified"}
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <CircleDollarSign size={isSmall ? 24 : 25} />{" "}
              <p className={`${isSmall ? "text-sm" : "text-base"}`}>
                {salary ?? "Not Specified"}
              </p>
            </div>
          </div>
        </div>
      </EmptyCard>
    </div>
  )
}

export default JobsCard
