import EmptyCard from "./EmptyCard"
import logo from "../../assets/icons8-google-48.png"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { SheetDescription } from "../ui/sheet"

interface CompanySmallCardProps {
  companyName: string
  FollowClicked: () => void
  companyDescription: string
}

const CompanySmallCard = ({
  FollowClicked,
  companyDescription,
  companyName,
}: CompanySmallCardProps) => {
  return (
    <EmptyCard cardClassname="bg-[#f5f5f5]">
      <div className="flex flex-col gap-4 pt-5 px-5 ">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <img className="w-10 h-10" src={logo} alt="company_logo" />
            <p className="text-base font-medium">{companyName}</p>
          </div>
          <Button onClick={FollowClicked} variant={"link"}>
            <div className="flex flex-row gap-1 items-center">
              <Plus className="" size={18} />
              <p>Follow</p>
            </div>
          </Button>
        </div>
        <div>
          <SheetDescription>{companyDescription}</SheetDescription>
        </div>
      </div>
    </EmptyCard>
  )
}

export default CompanySmallCard
