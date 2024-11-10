import {Button, TextInput, Center} from '@mantine/core';
import './RegistrationBox.css';
import '@mantine/core/styles.css';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';
import { useState } from 'react';
import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api-example'; 

export function RegistrationBox(){
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const handleFNameChange = (event: ChangeEvent<HTMLInputElement>) => {setFirstName(event.target.value);};
    const handleLNameChange = (event: ChangeEvent<HTMLInputElement>) => {setLastName(event.target.value);};
    const handleEmailChange = (newEmail: string) => setEmail(newEmail);
    const handlePasswordChange = (newPassword: string) => setPassword(newPassword);

    const navigate = useNavigate();
    // const navigateToVerification = () => {navigate('./otp')}
    const handleRegister = async () => {
        const registrationData = {
          firstName,
          lastName,
          email,
          password,
        };

        try {
            const response = await apiClient.post('/api/Auth/register', registrationData);
      
            if (response.status === 200) {
              const { id } = response.data; // Get the user ID from the response
      
              console.log('Registration successful', response.data);
              // Redirect to verification page with the user ID for OTP verification
              navigate(`./otp?id=${id}`);
            } else {
              setErrorMessage('Registration failed. Please try again.');
              console.error('Registration failed', response.status);
            }
        } catch (error) {
            setErrorMessage('An error occurred during registration.');
            console.log(errorMessage);
            console.error('Error:', error);
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
                value={firstName}
                onChange={handleFNameChange}
            /></div>
            <div><TextInput
                label="Prezime"
                placeholder="Surname"
                value={lastName}
                onChange={handleLNameChange}
            /></div>
            <div><EmailInput  value={email} onChange={handleEmailChange}/></div>
            <div><CustomPasswordInput value={password} onChange={handlePasswordChange}/></div>
        </div>
        <div className='footerRegistration'>
            <div className='buttonDivReg'><Button
                className="loginButton"
                size="md"
                variant="light"
                color="blue"
                onClick={handleRegister}>REGISTRIRAJ SE</Button>
            </div>
        </div>
    </div>
    </Center>)
    ;
}