import { useState } from 'react';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';
import { Button, Center, Anchor } from '@mantine/core';
import { UserLoginData } from '../pages/Login';
import './LoginBox.css';
import '@mantine/core/styles.css';
import { Link } from 'react-router-dom';

export function LoginBox(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    const handleEmailChange = (newEmail: string) => setEmail(newEmail);
    const handlePasswordChange = (newPassword: string) => setPassword(newPassword);

    const handleSubmit = async () => {
        const loginData: UserLoginData = { email, password };
        
        try {
            const response = await fetch('https://localhost:5000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful', data);
                // TO DO redirect navigation
            } else {
                console.error('Login failed', response.status);
            }
        } catch (error) {
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