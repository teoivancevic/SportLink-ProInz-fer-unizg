import { useState } from 'react';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';
import { Button, Center, Anchor } from '@mantine/core';
import './LoginBox.css';
import '@mantine/core/styles.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api-example';

export function LoginBox(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const handleEmailChange = (newEmail: string) => setEmail(newEmail);
    const handlePasswordChange = (newPassword: string) => setPassword(newPassword);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const loginData = { email, password };
    
        try {
          const response = await apiClient.post('/api/Auth/login', loginData);
    
          if (response.status === 200) {
            const token = response.data.token; //mogu li pretpostaviti da ima token
            localStorage.setItem('authToken', token);
    
            console.log('Login successful', response.data);
            navigate('../authorized/'); // Redirect to  authorized page
          } else {
            setErrorMessage('Login failed. Please try again.');
            console.error('Login failed', response.status);
          }
        } catch (error) {
          setErrorMessage('An error occurred during login.');
          console.error('Error:', error);
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
                <div><EmailInput value={email} onChange={handleEmailChange}/></div>
                <div><CustomPasswordInput value={password} onChange={handlePasswordChange}/></div>
            </div>
            <div className='footerLogin'>
                <div className='buttonDiv'><Button
                className="loginButton"
                size="md"
                variant="light"
                color="blue"
                onClick={handleSubmit}>PRIJAVI SE</Button></div>
                <div className='messageDiv'>
                    <p className='message1'>Nemate korisnički račun?<br/>
                    <Anchor component={Link} to="../registration">Registrirajte se</Anchor>
                    </p>
                </div>
            </div>
        </div>
    </Center>);
}