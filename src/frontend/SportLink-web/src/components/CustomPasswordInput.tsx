import { PasswordInput, Text, Group, Anchor } from '@mantine/core';

interface CustomPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomPasswordInput({ value, onChange }: CustomPasswordInputProps) {
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
      <PasswordInput 
        placeholder="Password" 
        id="your-password" 
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}/>
    </>
  );
}