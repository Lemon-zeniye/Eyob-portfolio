import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import axios from "axios"

interface AuthContextProps {
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

export const BASE_URL = "http://194.5.159.228:3002"

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
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
        setIsLoggedIn(true)
      } else {
        throw new Error("Login failed, tokens missing")
      }

      return response.data
    } catch (error) {
      setError("Error logging in. Please try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
