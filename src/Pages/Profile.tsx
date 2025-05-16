import ProfileCard from "@/components/Card/ProfileCard_social"
import CompanyProfileCard from "@/components/Profile/CompanyProfile"
import { useRole } from "@/Context/RoleContext"
// import { UserProvider } from "@/Context/UserContext"

const Profile = () => {
  const { role } = useRole()
  return (
    <div className="w-full pr-5 flex flex-col ">
      {role === "company" ? <CompanyProfileCard /> : <ProfileCard />}
    </div>
  )
}

export default Profile
