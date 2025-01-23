"use client"

import { PageHeader } from "@/components/ui-custom/page-header"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OrganizationSingleRootPage() {
  const router = useRouter()

  useEffect(() => {
    router.back()
  }, [router])

  return (
    <PageHeader
      title="Preusmjeravanje..."
      description="Vraćamo vas na prethodnu stranicu."
    >
        <p></p>
    </PageHeader>
  )
}