import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "brand") {
    redirect("/creator/dashboard")
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation role="brand" user={user} />
      <main>{children}</main>
    </div>
  )
}
