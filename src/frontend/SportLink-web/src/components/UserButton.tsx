import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core';

export function UserButton() {
  return (
    <UnstyledButton style={{display: "block",
        width:" 100%", padding:"10px"}}>
      <Group>
        <Avatar
          src=""
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            Harriette Spoonlicker
          </Text>

          <Text c="dimmed" size="xs">
            hspoonlicker@outlook.com
          </Text>
        </div>

      </Group>
    </UnstyledButton>
  );
}