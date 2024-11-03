import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet"
import {
  Briefcase,
  CircleDollarSign,
  Flag,
  HardHat,
  MapPin,
} from "lucide-react"
import CompanySmallCard from "../Card/CompanySmallCard"
import { Button } from "../ui/button"

interface JobsDetailProps {
  open: boolean
  onChange: (open: boolean) => void
  jobTitle: string
  jobDescription: string
  skills: string[]
  location: string
  locationType: string
  salary: number
  companyName: string
  FollowClicked: () => void
  companyDescription: string
  ApplyClicked: () => void
  ReportClicked: () => void
}

const JobsDetail = ({
  open,
  onChange,
  FollowClicked,
  companyDescription,
  companyName,
  jobDescription,
  jobTitle,
  location,
  locationType,
  salary,
  skills,
  ApplyClicked,
  ReportClicked,
}: JobsDetailProps) => {
  return (
    <Sheet open={open} onOpenChange={onChange}>
      <SheetContent
        side={"bottom"}
        className="h-[80vh] flex flex-col gap-2 overflow-y-scroll"
      >
        <SheetHeader>
          <SheetDescription className="text-xl text-black font-bold">
            {jobTitle}
          </SheetDescription>
        </SheetHeader>
        <div className="w-full flex sm-phone:flex-col md:flex-row justify-between gap-10">
          <div className="lg:w-3/4 md:w-1/2 flex flex-col gap-4">
            <SheetDescription className="text-base">
              {jobDescription}
            </SheetDescription>
            <div className="flex flex-col gap-4">
              <SheetDescription className="text-base text-black font-bold">
                Skills
              </SheetDescription>
              <div className="flex flex-row gap-4 flex-wrap">
                {skills.map((item) => (
                  <div className="flex flex-row gap-2 items-center">
                    <div className="bg-primary flex items-center justify-center p-2 text-white rounded-md">
                      <HardHat className="" />
                    </div>
                    <p className="text-xl font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-1/4 md:w-1/2 flex flex-col gap-4">
            <div className="w-full flex opacity-75 flex-col  gap-5 ">
              <div className="flex flex-row gap-2 items-center">
                <MapPin />
                <p className={``}>{location}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Briefcase /> <p className={``}>{locationType}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <CircleDollarSign />
                <p className={``}>{salary}</p>
              </div>
            </div>
            <div className=" w-full">
              <CompanySmallCard
                FollowClicked={FollowClicked}
                companyDescription={companyDescription}
                companyName={companyName}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Button onClick={ApplyClicked}>Apply</Button>
              <Button onClick={ReportClicked} variant={"destructive"}>
                <div className="flex flex-row gap-2 items-center">
                  <Flag size={20} />
                  <p>Report</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default JobsDetail
