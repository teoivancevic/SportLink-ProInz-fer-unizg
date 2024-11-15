
import { MainLayoutWithNavbar } from "./MainLayoutWithNavbar";
import AuthorizedElement from "../components/authorization/AuthorizedElement";
import AdminOrganizationList from "../components/organization/AdminOrganizationList";
import { UserRole } from "../types/roles";

export function AdminOrganizations() {

  return(
    <>
      <MainLayoutWithNavbar>

        <AuthorizedElement roles={[UserRole.AppAdmin]}>
          {() => 
            <AdminOrganizationList />
          }
        </AuthorizedElement>

      </MainLayoutWithNavbar>
    </>
  );
}