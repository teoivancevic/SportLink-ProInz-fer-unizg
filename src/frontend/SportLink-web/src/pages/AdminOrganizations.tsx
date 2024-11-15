import { Center, Text } from "@mantine/core";
import { MainLayoutWithNavbar } from "./MainLayoutWithNavbar";
import React, { useEffect, useState } from 'react';
import AuthorizedElement from "../components/AuthorizedElement";
import AdminOrganizationList from "../components/AdminOrganizationList";
import { UserRole } from "../types/roles";

export function AdminOrganizations() {

  return(
    <>
      {/* <MainLayoutWithNavbar> */}
        {/* TODO TABLICA MANTINE */}
        
        <Center>
          

        <Text>Popis organizacija</Text>
        <AuthorizedElement roles={[UserRole.AppAdmin]}>
          {({ userData }) => 
            <AdminOrganizationList />
          }
        </AuthorizedElement>
        
        </Center>
        

      {/* </MainLayoutWithNavbar> */}
    </>
  );
}