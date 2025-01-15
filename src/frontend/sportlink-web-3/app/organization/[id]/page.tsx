// app/organizations/[id]/page.tsx
export default function OrganizationPage({ params }: { params: { id: string } }) {
    return <div>Organization {params.id}</div>
  }