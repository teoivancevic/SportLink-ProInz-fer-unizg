import './RegistrationEndBox.css';
import { Center, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

export function RegistrationEndBox(){
    return(
        <Center style={{ height: '100vh' }}>
            <div className='message'>
                <div><text className='confirmationText'>E-mail adresa uspješno potvrđena.</text></div>
                <div><text className='backText'>Vrati se na <Anchor component={Link} to="../login">Prijavu</Anchor></text></div> 
            </div>
        </Center>
    );
}