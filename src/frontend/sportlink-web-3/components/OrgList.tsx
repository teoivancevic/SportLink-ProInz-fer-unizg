import type { OrganizationForAdmin } from "@/types/index"
import { VerificationStatusEnum } from "@/types/index"
import { Badge } from "./ui/badge";


interface OrgListProps {
  organizations: OrganizationForAdmin[]
}

function getStatusBadge(status: VerificationStatusEnum) {
  switch (status) {
    case VerificationStatusEnum.Accepted:
      return { text: "Prihvaćeno", color: "bg-green-100 text-green-800" };
    case VerificationStatusEnum.Rejected:
      return { text: "Odbijeno", color: "bg-red-100 text-red-800" };
    case VerificationStatusEnum.Unverified:
    default:
      return { text: "Nepotvrđeno", color: "bg-yellow-100 text-yellow-800" };
  }
}

export default function OrgList({ organizations }: OrgListProps) {
  return (
    <div className="pl-8">
      <h3 className="font-semibold mb-2">Organizacije:</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokacija</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {organizations.map((org, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{org.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{org.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{org.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={`${getStatusBadge(org.verificationStatus).color}`}>
                  {getStatusBadge(org.verificationStatus).text}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

