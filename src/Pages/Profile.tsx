import ProfileCard from "@/components/Card/ProfileCard"
import { UserProvider } from "@/Context/UserContext"

const Profile = () => {
  return (
    <div className="w-full pr-5 flex flex-col ">
      <UserProvider>
        <ProfileCard />
      </UserProvider>
    </div>
  )
}

export default Profile
