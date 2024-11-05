import { PasswordInput, Text, Group, Anchor } from '@mantine/core';

export function CustomPasswordInput() {
  return (
    <>
      <Group justify="space-between" mb={5}>
        <Text component="label" htmlFor="your-password" size="sm" fw={500}>
          Zaporka
        </Text>

        <Anchor href="#" onClick={(event) => event.preventDefault()} pt={2} fw={500} fz="xs">
          Zaboravili ste zaporku?
        </Anchor>
      </Group>
      <PasswordInput placeholder="Password" id="your-password" />
    </>
  );
}