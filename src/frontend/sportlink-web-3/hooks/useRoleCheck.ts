// hooks/useRoleCheck.ts
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-context';
import { orgService } from '@/lib/services/api';
import { useToast } from "@/hooks/use-toast"
import { UserRole } from '@/types/roles';

export const useRoleCheck = () => {
  const { userData, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!userData || userData.role === UserRole.OrganizationOwner) return;
    
    const checkRole = async () => {
      try {
        const response = await orgService.getMyOrganizations();
        if (response.data.length > 0) {
          toast({
            title: "Account Updated",
            description: "Your account has been upgraded to Organization Owner. Please log in again.",
          });
          logout();
        }
      } catch (error) {
        console.error('Role check failed:', error);
      }
    };

    const interval = setInterval(checkRole, 5 * 1000); // 15 seconds
    return () => clearInterval(interval);
  }, [userData, logout]);
};