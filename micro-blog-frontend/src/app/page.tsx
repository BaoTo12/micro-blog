"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { Sidebar } from "@/components/sidebar"
import { samplePosts } from "../../constants/sample-data"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="max-w-2xl mx-auto">
              <CreatePost />

              <div className="space-y-0">
                {samplePosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
