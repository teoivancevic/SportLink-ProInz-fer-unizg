import {Button, TextInput, Center} from '@mantine/core';
import './RegistrationBox.css';
import '@mantine/core/styles.css';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';
import { useState } from 'react';
import { ChangeEvent } from 'react';

export function RegistrationBox(){
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    const handleFNameChange = (event: ChangeEvent<HTMLInputElement>) => {setFirstName(event.target.value);};
    const handleLNameChange = (event: ChangeEvent<HTMLInputElement>) => {setLastName(event.target.value);};
    const handleEmailChange = (newEmail: string) => setEmail(newEmail);
    const handlePasswordChange = (newPassword: string) => setPassword(newPassword);

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
                color="blue">REGISTRIRAJ SE</Button>
            </div>
        </div>
    </div>
    </Center>)
    ;
}