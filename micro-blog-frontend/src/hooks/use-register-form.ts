"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function useRegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          const token = data.result;
          localStorage.setItem("token", token);
          const { decodeJwt } = await import("@/lib/utils");
          const decodedToken = decodeJwt(token);
          if (decodedToken && decodedToken.userId) {
            localStorage.setItem("userId", decodedToken.userId);
          }
          router.push("/auth/complete");
        } else {
          setError("Registration successful, but failed to log in.");
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to register. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again later.")
      console.error("Registration error:", error)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleRegister,
  }
}
