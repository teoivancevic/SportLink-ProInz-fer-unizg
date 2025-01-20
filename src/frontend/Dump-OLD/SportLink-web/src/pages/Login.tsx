import { LoginBox } from '../components/authentication/LoginBox.tsx';

export interface UserLoginData {
  email: string; 
  password: string;
}

export function Login() {
  return <LoginBox/>;
}