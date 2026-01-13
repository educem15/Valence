import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "creator") {
    redirect("/brand/dashboard")
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation role="creator" user={user} />
      <main>{children}</main>
    </div>
  )
}
