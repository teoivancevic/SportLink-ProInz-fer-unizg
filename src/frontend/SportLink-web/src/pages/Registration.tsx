import { RegistrationBox } from '../components/RegistrationBox.tsx';

export interface UserRegistrationData {
  name: string;
  surname: string;
  email: string; 
  password: string;
}

export function Registration() {
  return <RegistrationBox/>;
}