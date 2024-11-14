import { useState } from 'react';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';
import { Button, Center, Anchor, Text } from '@mantine/core';
import './LoginBox.css';
import '@mantine/core/styles.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { LoginRequest } from '../types/auth';
import { useDisclosure } from '@mantine/hooks';

export function LoginBox(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, { open, close }] = useDisclosure(false);
    
    const handleEmailChange = (newEmail: string) => {setEmail(newEmail); setErrorMessage(null)};
    const handlePasswordChange = (newPassword: string) =>  {setPassword(newPassword); setErrorMessage(null)};

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const loginData: LoginRequest = { email, password };
    
        try {
          open();
          const response = await authService.login(loginData);
          const token: string = response.data;
          console.log(response);
          console.log(response.data);
          console.log(token);
            
          localStorage.setItem('authToken', token);
          console.log(localStorage.getItem('authToken'));
          navigate('/');
    
        } catch (error) {
          setErrorMessage('Neispravni podaci za prijavu');
          console.error('Error:', error);
        } finally {
            close();
        }
      };

    return (
    <Center style={{height: '100vh'}}>
        <div className='containerLogin'>
            <div className='headerLogin'>
                <div><h3>PRIJAVA</h3></div>
                <div className='line'></div>
            </div>
            <div className='inputsLogin'>
                <div className='fixedSizeInput'><EmailInput value={email} onChange={handleEmailChange}/></div>
                <div className='fixedSizeInput'><CustomPasswordInput value={password} onChange={handlePasswordChange}/></div>
            </div>
            <div className='footerLogin'>
                <div className='buttonDiv'>
                <Button
                    loading = {loading}
                    className="loginButton"
                    size="md"
                    variant="light"
                    color="blue"
                    onClick={handleSubmit}>PRIJAVI SE
                    </Button></div>
                {/* Conditionally render error message if it exists */}
                {errorMessage && (
                <div className="error-message">
                    <Text style={{color:"red"}}>{errorMessage}</Text>
                </div>
                )}
                <div className='messageDiv'>
                    <p className='message1'>Nemate korisnički račun?<br/>
                    <Anchor component={Link} to="../registration">Registrirajte se</Anchor>
                    </p>
                </div>
            </div>
        </div>
    </Center>);
}