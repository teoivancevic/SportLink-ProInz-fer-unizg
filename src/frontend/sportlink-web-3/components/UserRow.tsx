"use client"

import { useState } from "react"
import type { User } from "@/types/index"
import OrgList from "./OrgList"
import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserRole } from "@/types/roles"

interface UserRowProps {
  user: User
}

export default function UserRow({ user }: UserRowProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (user.role === "OrgOwner") {
      setExpanded(!expanded)
    }
  }

  const renderLoginSource = () => {
    console.log(user);
    if (user.externalUserSource === 1) {
      return (
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </span>
      )
    } else {
      return (
        <span className="flex items-center">
          <Mail size={16} className="mr-1" />
          Email
          {user.isEmailVerified ? (
            <CheckCircle size={16} className="ml-1 text-green-600" />
          ) : (
            <AlertCircle size={16} className="ml-1 text-yellow-600" />
          )}
        </span>
      )
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OrganizationOwner":
        return "bg-blue-100 text-blue-800"
      case "AppAdmin":
        return "bg-purple-100 text-purple-800"
      case "User":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 3:
        return UserRole.User;
      case 2:
        return UserRole.OrganizationOwner;
      case 1:
        return UserRole.AppAdmin;
      default:
        return 'Unknown Role';
    }
  }

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          {user.role === "OrgOwner" && (
            <button onClick={toggleExpand} className="focus:outline-none">
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.firstName}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.lastName}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge className={`${getRoleBadgeColor(getRoleName(user.roleId))}`}>
            {getRoleName(user.roleId)}
          </Badge>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{renderLoginSource()}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.createdAt}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.lastLoginAt}</td>
      </tr>
      {expanded && user.role === "OrgOwner" && user.organizations && (
        <tr>
          <td colSpan={9} className="px-6 py-4 bg-gray-50">
            <OrgList organizations={user.organizations} />
          </td>
        </tr>
      )}
    </>
  )
}

