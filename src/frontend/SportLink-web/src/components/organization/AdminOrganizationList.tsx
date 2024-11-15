import React, { useEffect, useState } from 'react';
import { orgService } from '../../services/api';
import type { Organization } from '../../types/org';
import { Button, Card, Container, Group, Text, TextInput, Title } from '@mantine/core';
// import { useForm } from '@mantine/form';
import { IconMail, IconPhone } from '@tabler/icons-react';
import NoOrganizations from './NoOrganizations';



const AdminOrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingAccept, setLoadingAccept] = useState<{ [key: string]: boolean }>({});
  const [loadingReject, setLoadingReject] = useState<{ [key: string]: boolean }>({});
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({});

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

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const acceptOrganization = async (orgId: number) => {
    setLoadingAccept(prev => ({ ...prev, [orgId]: true }));
    try{
     const response = await orgService.acceptOrganization(orgId);
     console.log(response)
     fetchOrganizations();

     // reload organizations here
    } catch (error) {
     console.log(error);
    } finally {
        setLoadingAccept(prev => ({ ...prev, [orgId]: false }));
      }
   };
   const rejectOrganization = async (orgId: number) => {
    const reason = rejectionReasons[orgId];
    setLoadingReject(prev => ({ ...prev, [orgId]: true }));
    console.log("reason", reason);
    try{
     const response = await orgService.rejectOrganization(orgId, reason);
     console.log(response)
     fetchOrganizations();

    } catch (error) {
     console.log(error);
    } finally {
        setLoadingReject(prev => ({ ...prev, [orgId]: false }));
      }
   };
  
   const handleReasonChange = (orgId: number, value: string) => {
    setRejectionReasons((prev) => ({ ...prev, [orgId]: value })); // Keep orgId unique
  };
  

  return (
    
    <Container padding="md">
      <Title order={2} style={{padding:"20px"}}>Organization List</Title>
      {organizations.length === 0 ? <NoOrganizations /> : null}
      <Group direction="column" spacing="md">
        {organizations.map(org => {
          // console.log("org", org.id)
          return (
          <Card key={org.name} shadow="sm" padding="lg" style={{ width: '100%' }}>
            <Group position="apart" align="flex-start">
              <Group direction="column" spacing="xs" style={{ flex: 1 }}>
                <Text fw={700}>{org.name}</Text>
                <Text size="sm" color="dimmed">{org.description}</Text>
                <Text size="sm">Lokacija: {org.location}</Text>
              </Group>
              <Group direction="column" spacing="xs" align="flex-end">
                <Group spacing="xs">
                  <IconMail size={16} />
                  <Text size="sm">{org.contactEmail}</Text>
                </Group>
                <Group spacing="xs">
                  <IconPhone size={16} />
                  <Text size="sm">{org.contactPhoneNumber}</Text>
                </Group>
              </Group>
            </Group>
            <Group position="apart" mt="md">
              <TextInput
                placeholder="Razlog odbijanja organizacije"
                value={rejectionReasons[org.id] || ''} // Use org.id for unique key
                onChange={(event) => handleReasonChange(org.id, event.currentTarget.value)}
                style={{ flex: 1 }} 
                disabled={loadingAccept[org.id] || loadingReject[org.id]}
              />

              <Group>
                <Button
                  loading={loadingReject[org.id]}
                  variant='outline'
                  color='red'
                  onClick={() => {
                    if (rejectionReasons[org.id]) {
                      rejectOrganization(org.id);
                    } else {
                      alert('Reason is required to reject the organization.');
                    }
                  }}
                  disabled={loadingAccept[org.id]}
                >
                  Odbij
                </Button>
                <Button
                  loading={loadingAccept[org.id]}
                  variant='filled'
                  onClick={() => acceptOrganization(org.id)}
                  disabled={loadingReject[org.id]}
                >
                  Odobri
                </Button>
              </Group>
            </Group>
          </Card>
        )})}
      </Group>
    </Container>
  );
};

export default AdminOrganizationList;