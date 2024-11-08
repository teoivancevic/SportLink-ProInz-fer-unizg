import './VerificationBox.css'
import { OTPInput } from './OTPInput';
import { useState } from 'react';
import { Center, Notification } from '@mantine/core';

export function VerificationBox(){
    const [otpValue, setOtpValue] = useState(Array(6).fill(''));
    const [showNotification, setShowNotification] = useState(true); 

    const handleResendClick = () => {setShowNotification(true);
        console.log('Resending verification code...');
    };
    return (
        <Center style={{ height: '100vh' }}>
            <div className='container'>
                <div className='message'>
                    <div><h5>Kod za verifikaciju e-mail adrese</h5></div>
                    <div className='instruction'>
                        <div><text className='text'>Molimo Vas unesite 6-znamekasti kod koji</text></div>
                        <div><text>Vam je poslan na Vašu e-mail adresu.</text></div>
                    </div>
                </div>
                <div className='codeInput'>
                    <OTPInput
                        length={6}
                        value={otpValue}
                        disabled={false}
                        onChange={setOtpValue}
                    />
                    <div><text>Niste primili kod?  <a href='#' onClick={handleResendClick}>Pošalji ponovno</a></text></div>
                </div>
            </div>
            {showNotification && (
                <Notification
                    title='Kod uspješno poslan'
                    withBorder
                    onClose={() => setShowNotification(false)} // Close the notification
                    style={{ position:"absolute",  bottom:"0px"}}
                >
                    Možete ponovno zatražiti kod za jednu minutu.
                </Notification>
            )}
        </Center>
    );
}
