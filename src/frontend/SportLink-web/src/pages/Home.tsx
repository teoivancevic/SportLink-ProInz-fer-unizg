// src/pages/Home.tsx
import { Container, Image, Title, Stack, Button, Alert } from '@mantine/core';
import { useGetData } from '../services/api';

interface DogApiResponse {
  message: string;  // image URL
  status: string;
}

export function Home() {
  const { data, error, isLoading } = useGetData<DogApiResponse>();

  if (error) {
    return (
      <Container size="sm" py="xl">
        <Alert title="Error" color="red" variant="filled">
          {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="xl">
        <Title order={1} size="h2">Random Dog Image</Title>
        
        {isLoading ? (
          <Image
            height={400}
            radius="md"
            src="https://placehold.co/400x400?text=Loading..."
          />
        ) : (
          <Image
            src={data?.message}
            height={400}
            radius="md"
            fallbackSrc="https://placehold.co/400x400?text=No+Image"
          />
        )}

        <Button 
          onClick={() => window.location.reload()}
          size="lg"
        >
          Get New Dog
        </Button>
      </Stack>
    </Container>
  );
}