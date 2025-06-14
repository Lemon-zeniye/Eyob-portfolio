import { PersonalInfo, UserProfile } from "@/Types/profile.type";
import Tabs from "../Tabs/TabsLine";
import EditProfile from "./EditProfile";
import PersonalInfoForm from "./PersonalInfoForm";
import Availability from "./Availability";

type ProfileTabProps = {
  profileInitialData: UserProfile | undefined;
  personalInfoInitialData: PersonalInfo | undefined;
  onSuccess: () => void;
};

export function ProfileTab({
  profileInitialData,
  personalInfoInitialData,
  onSuccess,
}: ProfileTabProps) {
  return (
    <div className="h-[60vh] overflow-y-auto">
      <Tabs tabs={["Profile", "Personal Info", "Availability"]}>
        <EditProfile initialData={profileInitialData} onSuccess={onSuccess} />
        <PersonalInfoForm
          initialData={personalInfoInitialData}
          onSuccess={onSuccess}
        />

        <Availability />
      </Tabs>
    </div>
  );
}
