"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function useCompleteForm() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState("")

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!displayName || !bio || !location) {
      setError("All fields are required.")
      return
    }

    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      setError("You must be logged in to complete your profile.")
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: parseInt(userId, 10),
          displayName,
          bio,
          location,
        }),
      })

      if (response.ok) {
        router.push("/") // Redirect to homepage on successful completion
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to complete profile.")
      }
    } catch (error) {
      setError("An error occurred. Please try again later.")
      console.error("Profile completion error:", error)
    }
  }

  return {
    displayName,
    setDisplayName,
    bio,
    setBio,
    location,
    setLocation,
    error,
    handleComplete,
  }
}
