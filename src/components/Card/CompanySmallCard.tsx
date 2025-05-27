import EmptyCard from "./EmptyCard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { SheetDescription } from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/Context/RoleContext";

interface CompanySmallCardProps {
  companyName: string | undefined;
  FollowClicked: () => void;
  companyDescription: string | undefined;
}

const CompanySmallCard = ({
  FollowClicked,
  companyDescription,
  companyName,
}: CompanySmallCardProps) => {
  const { mode } = useRole();
  return (
    <EmptyCard cardClassname="bg-[#f5f5f5]">
      <div className="flex flex-col gap-4 pt-5 px-5 ">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage />
              <AvatarFallback
                className={`${
                  mode === "formal" ? "bg-primary/30 " : "bg-primary2/30 "
                } `}
              >
                {companyName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="text-base font-medium">{companyName}</p>
          </div>
          <Button onClick={FollowClicked} variant={"link"}>
            <div
              className={`flex flex-row gap-1 items-center ${
                mode === "formal" ? "text-primary" : "text-primary2"
              } `}
            >
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
  );
};

export default CompanySmallCard;
