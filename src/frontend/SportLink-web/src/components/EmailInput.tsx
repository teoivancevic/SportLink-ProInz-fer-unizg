import { TextInput, rem } from '@mantine/core';
import { IconAlertTriangle, IconAt } from '@tabler/icons-react';
import classes from './EmailInput.module.css';
import { useState } from 'react';

export function EmailInput() {
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(true);
  
    // Function to validate the email format
    const validateEmail = (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    };
  
    // Update the validity and email state on change
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setEmail(value);
        setIsValid(validateEmail(value));
    };
    

  return (
    <TextInput
      label="E-mail adresa"
      error={!isValid && "Invalid email"}
      value={email}
      onChange={handleEmailChange}
      classNames={{
        input: isValid ? '' : 'invalid-email', // Apply class when invalid
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