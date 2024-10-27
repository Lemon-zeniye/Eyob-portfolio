// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react"
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
        // console.log("Tokens stored:", { accessToken, refreshToken })
      } else {
        console.error("Tokens not found in response:", response.data)
        throw new Error("Login failed, tokens missing")
      }

      //   console.log(response.data)

      setIsLoggedIn(true)
      return response.data
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    window.location.reload()
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
