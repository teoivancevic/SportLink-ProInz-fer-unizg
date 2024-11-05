import {Button, TextInput} from '@mantine/core';
import './RegistrationBox.css';
import '@mantine/core/styles.css';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';

export function RegistrationBox(){
    return (<div className='container'>
        <div className='header'>
            <h2>REGISTRACIJA</h2>
            <div className='line'></div>
        </div>
        <div className='inputs'>
            <div><TextInput
                label="Ime"
                placeholder="Name"
            /></div>
            <div><TextInput
                label="Prezime"
                placeholder="Surname"
            /></div>
            <div><EmailInput/></div>
            <div><CustomPasswordInput/></div>
        </div>
        <div className='footer'>
            <div className='buttonDiv'><Button
                className="loginButton"
                size="md"
                variant="light"
                color="blue">REGISTRIRAJ SE</Button>
            </div>
        </div>
    </div>)
    ;
}