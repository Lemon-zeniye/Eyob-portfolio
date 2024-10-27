import axios from "axios"

export const BASE_URL = "http://194.5.159.228:3002"

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password,
    })
    const accessToken = response.data.accessToken
    const refreshToken = response.data.refreshToken

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      // console.log("Tokens stored:", { accessToken, refreshToken })
    } else {
      console.error("Tokens not found in response:", response.data)
      throw new Error("Login failed, tokens missing")
    }

    console.log(response.data)

    return response.data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export const fetchJobs = async () => {
  try {
    const token = localStorage.getItem("accessToken")
    if (!token) throw new Error("No access token found in local storage")

    const response = await axios.get(`${BASE_URL}/api/job/fetchJob`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // console.log("Jobs fetched:", response.data)

    return response.data
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw error
  }
}
