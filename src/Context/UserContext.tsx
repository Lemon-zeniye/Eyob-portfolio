import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import {
  fetchUserEducation,
  fetchUserExperience,
  fetchAllUserPosts,
  fetchUserSkills,
  fetchUserProfile,
} from "@/Api/api"
import {
  PostTypes,
  UserEducation,
  UserExperience,
  UserProfile,
  // UserSkill,
} from "@/components/Types"

interface UserData {
  education: UserEducation[]
  experience: UserExperience[]
  posts: PostTypes[]
  profile: UserProfile
  skills: string[]
  loading: boolean
  error: string | null
}

const defaultUserData: UserData = {
  education: [],
  experience: [],
  posts: [],
  skills: [],
  profile: {
    bio: "",
    createdAt: "",
    location: "",
    position: "",
    userid: "",
    __v: 0,
    _id: "",
  },
  loading: false,
  error: null,
}

const UserContext = createContext<UserData>(defaultUserData)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const educatioResponse = await fetchUserEducation()
        const experienceResponse = await fetchUserExperience()
        const postsResponse = await fetchAllUserPosts()
        const skillsResponse = await fetchUserSkills()
        const profileResponse = await fetchUserProfile()

        const posts = postsResponse.data
        const experience = experienceResponse.data
        const education = educatioResponse.data
        const skills = skillsResponse.data.skill
        const profile = profileResponse.data

        setUserData({
          education,
          experience,
          posts,
          skills,
          profile,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUserData((prevState) => ({
          ...prevState,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        }))
      }
    }

    fetchData()
  }, [])

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
