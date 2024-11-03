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
} from "@/Api/api"
import {
  PostTypes,
  UserEducation,
  UserExperience,
  // UserSkill,
} from "@/components/Types"

interface UserData {
  education: UserEducation[]
  experience: UserExperience[]
  posts: PostTypes[]
  skills: string[]
  loading: boolean
  error: string | null
}

const defaultUserData: UserData = {
  education: [],
  experience: [],
  posts: [],
  skills: [],
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

        const posts = postsResponse.data
        const experience = experienceResponse.data
        const education = educatioResponse.data
        const skills = skillsResponse.data.skill

        setUserData({
          education,
          experience,
          posts,
          skills,
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
