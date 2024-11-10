import './VerificationBox.css'
import { OTPInput } from './OTPInput';
import { useState, useEffect } from 'react';
import { Center, Notification } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/api-example';

export function VerificationBox(){
    const {id} = useParams();
    const [otpValue, setOtpValue] = useState(Array(6).fill(''));
    const [showNotification, setShowNotification] = useState(true); 
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleResendClick = () => {
        setShowNotification(true);
        console.log('Resending verification code...');
    };

    const handleSubmit = async () => {
        const enteredOTP = otpValue.join('');
        const userIdParam = id ? parseInt(id, 10) : 0; // User ID from the URL params

        if (enteredOTP.length === 6) {
            try {
                // Send a PUT request to verify OTP
                const response = await apiClient.put('/api/Auth/verify', {
                    userId: userIdParam,
                    otpCode: enteredOTP,
                });

                if (response.data === true) {
                    // If OTP verification is successful, navigate to the confirmation page
                    navigate('/registration/success');
                } else {
                    // If OTP verification fails, stay on the page and show an error message
                    setErrorMessage('Invalid OTP. Please try again.');
                }
            } catch (error) {
                console.error('Error during OTP verification:', error);
                setErrorMessage('An error occurred during OTP verification.');
            }
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
