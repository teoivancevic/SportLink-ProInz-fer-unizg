import './VerificationBox.css'
import { OTPInput } from './OTPInput';
import { useState, useEffect } from 'react';
import { Center, Notification } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { ResendOTPRequest, VerifRequest } from '../types/auth';

export function VerificationBox(){
    const [otpValue, setOtpValue] = useState(Array(6).fill(''));
    const [showNotification, setShowNotification] = useState(false); 
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const navigate = useNavigate();

    const handleResendClick = async () => {
        const userId = id ? parseInt(id, 10) : 0;
        const resendOTPData: ResendOTPRequest = {
            userId
        }
        try{
            const response = await authService.resendOTP(resendOTPData);
            setShowNotification(true); // notification to user that otp is successfully sent
        } catch (error) {
            console.error('Error during OTP verification:', error);
        }
    };

    const handleSubmit = async () => {
        const otpCode = otpValue.join('');
        const userId = id ? parseInt(id, 10) : 0;

        const verifData: VerifRequest = {
            userId, otpCode
        }

        if (otpCode.length === 6) {
            try { 
                const response = await authService.verify(userId, otpCode, verifData);
                console.log("Verification successful:", response.data);
                navigate('/registration/success');

            } catch (error) {
                console.error('Error during OTP verification:', error);
                setErrorMessage('An error occurred during OTP verification.');
                console.log(errorMessage);
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
                    onClose={() => setShowNotification(false)}
                    style={{ position:"absolute",  bottom:"0px"}}
                >
                    Možete ponovno zatražiti kod za jednu minutu.
                </Notification>
            )}
        </Center>
    );
}
