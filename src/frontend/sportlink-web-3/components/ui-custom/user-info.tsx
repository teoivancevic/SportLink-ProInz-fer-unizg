import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  
  export interface UserInfoProps {
    user: {
      firstName: string
      lastName: string
      email: string
      avatar: string
    }
    className?: string
    avatarClassName?: string
    size?: 'sm' | 'md' | 'lg',
    showAvatar?: boolean
  }
  
  export function UserInfo({ 
    user, 
    className = "", 
    avatarClassName = "h-8 w-8",
    size = 'md',
    showAvatar = true
  }: UserInfoProps) {
    const textSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }
  
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showAvatar && (
          <Avatar className={`rounded-lg ${avatarClassName}`}>
            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="rounded-lg">
              {user.firstName.charAt(0) + user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`grid flex-1 text-left leading-tight ${textSizes[size]}`}>
          <span className="truncate font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
      </div>
    )
  }