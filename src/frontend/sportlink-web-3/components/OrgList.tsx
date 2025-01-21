import type { Organization } from "@/types"

interface OrgListProps {
  organizations: Organization[]
}

export default function OrgList({ organizations }: OrgListProps) {
  return (
    <div className="pl-8">
      <h3 className="font-semibold mb-2">Owned Organizations:</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {organizations.map((org, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{org.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{org.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{org.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">{org.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

