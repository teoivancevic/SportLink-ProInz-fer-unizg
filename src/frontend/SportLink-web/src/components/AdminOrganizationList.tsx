import React, { useEffect, useState } from 'react';
import { orgService } from '../services/api';
import type { GetOrganizationResponse, Organization } from '../types/org';
import { Button, Card, Container, Group, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconPhone } from '@tabler/icons-react';



const AdminOrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: string }>({});



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

  const acceptOrganization = async (orgId: number) => {
    setLoading(prev => ({ ...prev, [orgId]: true }));
    try{
     const response = await orgService.acceptOrganization(orgId);
     console.log(response)

     // reload organizations here
    } catch (error) {
     console.log(error);
    } finally {
        setLoading(prev => ({ ...prev, [orgId]: false }));
      }
   };
   const rejectOrganization = async (orgId: number) => {
    const reason = rejectionReasons[orgId];
    setLoading(prev => ({ ...prev, [orgId]: true }));
    console.log("reason", reason);
    try{
     const response = await orgService.rejectOrganization(orgId, reason);
     console.log(response)
     // reload organizations here

    } catch (error) {
     console.log(error);
    } finally {
        setLoading(prev => ({ ...prev, [orgId]: false }));
      }
   };
  
   const handleReasonChange = (orgId: number, value: string) => {
    setRejectionReasons(prev => ({ ...prev, [orgId]: value }));
  };

  return (
    <Container padding="md">
      <Title order={2}>Organization List</Title>
      <Group direction="column" spacing="md">
        {organizations.map(org => (
          <Card key={org.name} shadow="sm" padding="lg" style={{ width: '90%' }}>
            <Group position="apart" align="flex-start">
              <Group direction="column" spacing="xs" style={{ flex: 1 }}>
                <Text fw={700}>{org.name}</Text>
                <Text size="sm" color="dimmed">{org.description}</Text>
                <Text size="sm">Location: {org.location}</Text>
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
                placeholder="Reason for rejection"
                value={rejectionReasons[org.id] || ''}
                onChange={(event) => handleReasonChange(org.id, event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Group>
                <Button
                  loading={loading[org.id]}
                  variant='outline'
                  color='red'
                  onClick={() => rejectOrganization(org.id)}
                >
                  Odbij
                </Button>
                <Button
                  loading={loading[org.id]}
                  variant='filled'
                  onClick={() => acceptOrganization(org.id)}
                >
                  Odobri
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Group>
    </Container>
  );
};

export default AdminOrganizationList;