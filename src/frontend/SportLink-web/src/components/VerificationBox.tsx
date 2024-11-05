import './VerificationBox.css'
import { OTPInput } from './OTPInput';
import { useState } from 'react';

export function VerificationBox(){
    const [otpValue, setOtpValue] = useState(Array(6).fill(''));
    return (
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
            <div><text>Niste primili kod?  <a href='#'>Pošalji ponovno</a></text></div>
        </div>
        
    </div>
    );
}