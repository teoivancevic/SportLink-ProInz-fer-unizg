import {Button, TextInput, Center, ButtonProps, Stack, Divider} from '@mantine/core';
import './RegistrationBox.css';
import '@mantine/core/styles.css';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';
import { useState } from 'react';
import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { RegistrationRequest } from '../types/auth';
import { useDisclosure } from '@mantine/hooks';
import { GoogleIcon } from '../assets/GoogleIcon'

export function GoogleButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
    return <Button leftSection={<GoogleIcon />} variant="default" {...props} />;
}

export function RegistrationBox(){
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, { open, close }] = useDisclosure(false);
    
    const handleFNameChange = (event: ChangeEvent<HTMLInputElement>) => {setFirstName(event.target.value);};
    const handleLNameChange = (event: ChangeEvent<HTMLInputElement>) => {setLastName(event.target.value);};
    const handleEmailChange = (newEmail: string) => setEmail(newEmail);
    const handlePasswordChange = (newPassword: string) => setPassword(newPassword);

    const navigate = useNavigate();

    const handleRegister = async () => {
        const registrationData: RegistrationRequest = {
          firstName,
          lastName,
          email,
          password,
        };

        try {
            open();
            const response = await authService.register(registrationData);
            console.log("Response Data:", response.data);
            const { id } = response.data;
      
            navigate(`/registration/otp?id=${id}`);
        } catch (error) {
            setErrorMessage('An error occurred during registration.');
            console.log(errorMessage);
            console.error('Error:', error);
        } finally {
            close();
        }
    };

    const handleGoogleLogin = async () => {
        try{
         const response = await authService.loginGoogle();
         console.log(response)
        } catch (error) {
         console.log(error);
        }
       };

    return (
    <Center style={{height:'100vh'}}>
    <div className='containerRegistration'>
        <div className='headerRegistration'>
            <h2>REGISTRACIJA</h2>
            <div className='line'></div>
        </div>
        <div className='inputsRegistration'>
            <div><TextInput
                label="Ime"
                placeholder="Name"
                required
                value={firstName}
                onChange={handleFNameChange}
            /></div>
            <div><TextInput
                label="Prezime"
                placeholder="Surname"
                required
                value={lastName}
                onChange={handleLNameChange}
            /></div>
            <div><EmailInput  value={email} onChange={handleEmailChange}/></div>
            <div><CustomPasswordInput value={password} onChange={handlePasswordChange}/></div>
        </div>
        <Stack >
        <div className='footerRegistration'>
            <div className='buttonDivReg'><Button
                className="loginButton"
                loading={loading}
                size="md"
                variant="light"
                color="blue"
                onClick={handleRegister}>REGISTRIRAJ SE</Button>
            </div>
            
        </div>
        <Divider label="ili" size={2} color='dark'></Divider>
        <GoogleButton onClick={handleGoogleLogin}>Registracija s Google računom</GoogleButton>
        </Stack>
        {/* TODO barbara, dodat padding i link natrag za login */}
        
    </div>
    </Center>)
    ;
}