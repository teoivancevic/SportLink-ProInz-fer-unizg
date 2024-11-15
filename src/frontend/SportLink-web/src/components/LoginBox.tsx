import { useState } from 'react';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';
import { Button, Center, Anchor, Text, ButtonProps, Stack, Paper, Divider } from '@mantine/core';
import './LoginBox.css';
import '@mantine/core/styles.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { LoginRequest } from '../types/auth';
import { useDisclosure } from '@mantine/hooks';
import { GoogleIcon } from '../assets/GoogleIcon'

export function GoogleButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
    return <Button leftSection={<GoogleIcon />} variant="default" {...props} />;
}

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
        <Paper radius="md" p="xl" withBorder style={{ width: '313px', backgroundColor: 'rgba(189, 189, 189, 0.2)', boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.4)' }}>
            <div className='containerLogin'>
            <div className='headerLogin'>
                <div><h3>PRIJAVA</h3></div>
                <div className='line'></div>
            </div>
            <div className='inputsLogin'>
                <div className='fixedSizeInput'><EmailInput value={email} onChange={handleEmailChange}/></div>
                <div className='fixedSizeInput'><CustomPasswordInput value={password} onChange={handlePasswordChange}/></div>
            </div>
            
                <Stack>
                <Button
                    loading = {loading}
                    className="loginButton"
                    size="md"
                    variant="light"
                    color="blue"
                    onClick={handleSubmit}>PRIJAVI SE
                    </Button>
                {/* Conditionally render error message if it exists */}
                {errorMessage && (
                
                    <Text size="sm" style={{color:"red", textAlign:"center"}}>{errorMessage}</Text>
                
                )}
                <Divider label="ili" size={2} color='dark'></Divider>
                <GoogleButton>Prijava s Google računom</GoogleButton>
                </Stack>
                <div className='messageDiv'>
                    <p className='message1'>Nemate korisnički račun?<br/>
                    <Anchor component={Link} to="../registration">Registrirajte se</Anchor>
                    </p>
                </div>
            </div>
        </Paper>
    </Center>);
}