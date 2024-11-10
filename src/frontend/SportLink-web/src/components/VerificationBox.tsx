import './VerificationBox.css'
import { OTPInput } from './OTPInput';
import { useState, useEffect } from 'react';
import { Center, Notification } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function VerificationBox(){
    const [otpValue, setOtpValue] = useState(Array(6).fill(''));
    const [showNotification, setShowNotification] = useState(true); 

    const navigate = useNavigate();
    const correctOTP = "123456"; //mock OTP

    const handleResendClick = () => {setShowNotification(true);
        console.log('Resending verification code...');
    };

    const handleSubmit = async () => {
        const enteredOTP = otpValue.join('');

        if (enteredOTP === correctOTP) {
            navigate('../registration/success');
            // try {
            //     // Send OTP to backend
            //     const response = await fetch('/api/verify-otp', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ otp: enteredOTP }),
            //     });

            //     if (response.ok) {
            //         navigate('/registration/success'); // Redirect to success page
            //     } else {
            //         console.log("Invalid OTP");
            //     }
            // } catch (error) {
            //     console.error('Failed to verify OTP:', error);
            // }
        }
    };

    // Watch for full OTP entry
    useEffect(() => {
        if (otpValue.every(value => value !== '')) {
            handleSubmit(); // Automatically submit when all OTP fields are filled
        }
    }, [otpValue]);

    return (
        <Center style={{ height: '100vh' }}>
            <div className='containerVerif'>
                <div className='messageVerif'>
                    <div><h5>Kod za verifikaciju e-mail adrese</h5></div>
                    <div className='instructionVerif'>
                        <div><text>Molimo Vas unesite 6-znamekasti kod koji</text></div>
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
