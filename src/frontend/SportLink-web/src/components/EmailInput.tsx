import { TextInput, rem } from '@mantine/core';
import { IconAlertTriangle, IconAt } from '@tabler/icons-react';
import classes from './EmailInput.module.css';
import { useState } from 'react';


interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailInput({ value, onChange }: EmailInputProps) {
    const [isValid, setIsValid] = useState(true);
  
    const validateEmail = (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      onChange(value);
      setIsValid(validateEmail(value));
      
  };
    

  return (
    <TextInput
      label="E-mail adresa"
      error={!isValid && "Invalid email"}
      value={value}
      onChange={handleEmailChange}
      classNames={{
        input: isValid ? '' : 'invalid-email',
      }}
      leftSection={<IconAt
        stroke={1.5}
        style={{ width: rem(18), height: rem(18) }}
        className={classes.icon}
        />}
      rightSection={
        <IconAlertTriangle
          stroke={1.5}
          style={{ width: rem(18), height: rem(18) }}
          className={classes.icon}
        />
      }
    />
  );
}