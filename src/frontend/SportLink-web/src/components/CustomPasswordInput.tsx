import { PasswordInput, Text, Group } from '@mantine/core';

interface CustomPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CustomPasswordInput({ value, onChange, error }: CustomPasswordInputProps) {
  const validatePassword = (value: string) => {
    if (value === '') {
      return null;
    }
    if (value.length < 8) {
      return 'Najmanje 8 znakova';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Barem jedno veliko slovo';
    }
    if (!/[a-z]/.test(value)) {
      return 'Barem jedno malo slovo';
    }
    if (!/[0-9]/.test(value)) {
      return 'Barem jedna brojka';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Barem jedan specijalni znak';
    }
    return null;
  };

  return (
    <>
      <Group justify="space-between" mb={5}>
        <Text component="label" htmlFor="your-password" size="sm" fw={500}>
          Zaporka
        </Text>

        {/* Optional forgot password link */}
        {/* <Anchor href="#" onClick={(event) => event.preventDefault()} pt={2} fw={500} fz="xs">
          Zaboravili ste zaporku?
        </Anchor> */}
      </Group>

      <PasswordInput 
        placeholder="Password" 
        id="your-password" 
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        error={error || validatePassword(value)}
      />
    </>
  );
}