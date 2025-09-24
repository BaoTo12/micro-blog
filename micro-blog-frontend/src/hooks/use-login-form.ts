"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { decodeJwt } from "@/lib/utils"

export function useLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required.")
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.result
        localStorage.setItem("token", token)
        const decodedToken = decodeJwt(token)
        if (decodedToken && decodedToken.userId) {
          localStorage.setItem("userId", decodedToken.userId)
        }
        router.push("/") // Redirect to homepage on successful login
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to login. Please check your credentials.")
      }
    } catch (error) {
      setError("An error occurred. Please try again later.")
      console.error("Login error:", error)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
  }
}
