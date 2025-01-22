import React from 'react';
import { Center, Text, Box } from '@mantine/core';

const NoOrganizations: React.FC = () => (
  <Center style={{ height: '100%' }}>
    <Box>
      <Text size="lg" fw={500} color="dimmed">
        Nema novih zahtjeva za registraciju organizacije.
      </Text>
    </Box>
  </Center>
);

export default NoOrganizations;