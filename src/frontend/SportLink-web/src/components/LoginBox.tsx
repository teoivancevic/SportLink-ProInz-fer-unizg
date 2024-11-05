import {Button} from '@mantine/core';
import './LoginBox.css';
import '@mantine/core/styles.css';
import { CustomPasswordInput } from './CustomPasswordInput';
import { EmailInput } from './EmailInput';

export function LoginBox(){
    return (<div className='container'>
        <div className='header'>
            <div><h3>PRIJAVA</h3></div>
            <div className='line'></div>
        </div>
        <div className='inputs'>
            <div><EmailInput/></div>
            <div><CustomPasswordInput/></div>
        </div>
        <div className='footer'>
            <div className='buttonDiv'><Button
            className="loginButton"
            size="md"
            variant="light"
            color="blue">PRIJAVI SE</Button></div>
            <div className='messageDiv'>
                <p className='message1'>Nemate korisnički račun?<br/><a href='#'>Registrirajte se</a></p>
            </div>
        </div>
        
    </div>)
    ;
}