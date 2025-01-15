import { UnstyledButton, Group, Avatar, Text, Menu } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

interface UserButtonProps {
  name: string;
  email: string;
  onLogout: () => void;
}

export function UserButton({ name, email, onLogout }: UserButtonProps) {
  return (
    <Menu position="right" withArrow>
      <Menu.Target>
        <UnstyledButton style={{ display: "block", width: "100%" }}>
          <Group>
            <Avatar src="" radius="xl" />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {name}
              </Text>
              <Text color="dimmed" size="xs">
                {email}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={onLogout}>
          <Group>
            <IconLogout size={16} />
            <Text>Logout</Text>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}