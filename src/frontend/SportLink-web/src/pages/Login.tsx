import { LoginBox } from '../components/LoginBox.tsx';

export interface UserLoginData {
  email: string; 
  password: string;
}

export function Login() {
  return <LoginBox/>;
}