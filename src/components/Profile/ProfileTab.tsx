import { PersonalInfo, UserProfile } from "@/Types/profile.type";
import Tabs from "../Tabs/TabsLine";
import EditProfile from "./EditProfile";
import PersonalInfoForm from "./PersonalInfoForm";

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
      <Tabs tabs={["Profile", "Personal Info"]}>
        <EditProfile initialData={profileInitialData} onSuccess={onSuccess} />
        <PersonalInfoForm
          initialData={personalInfoInitialData}
          onSuccess={onSuccess}
        />
      </Tabs>
    </div>
  );
}
