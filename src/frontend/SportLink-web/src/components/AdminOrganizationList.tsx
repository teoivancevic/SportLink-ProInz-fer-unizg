import React, { useEffect, useState } from 'react';
import { orgService } from '../services/api';
import type { GetOrganizationResponse, Organization } from '../types/org';

const AdminOrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await orgService.getOrganizations(false); // get unverified
        console.log("response", response);
        setOrganizations(response.data);
        console.log("organizacijeee", organizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <>
        <h2>org list component</h2>
        <ul>
            {organizations.map(org => (
                <li key={org.name}>{org.name}</li>
            ))}
        </ul>
    </>
  );
};

export default AdminOrganizationList;