// app/organizations/[id]/reviews/page.tsx
export default function OrganizationReviewsPage({ params }: { params: { id: string } }) {
    return <div>Reviews for organization {params.id}</div>
  }