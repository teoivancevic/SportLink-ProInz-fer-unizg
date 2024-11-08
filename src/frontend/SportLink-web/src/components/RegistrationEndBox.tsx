import './RegistrationEndBox.css';
import { Center } from '@mantine/core';

export function RegistrationEndBox(){
    return(
        <Center style={{ height: '100vh' }}>
            <div className='message'>
                <div><text className='confirmationText'>E-mail adresa uspješno potvrđena.</text></div>
                <div><text className='backText'>Vrati se na <a href="#"> Prijavu</a></text></div> 
                {/* TO DO onClick */}
            </div>
        </Center>
    );
}