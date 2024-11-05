import React, { useRef } from 'react';
import './OTPInput.css';

type OTPInputProps = {
    length: number;
    value: string[];
    disabled: boolean;
    onChange(value: string[]): void;
};

export const OTPInput: React.FC<OTPInputProps> = ({
    length,
    disabled,
    value,
    onChange,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const onChangeValue = (text: string, index: number) => {
        const newValue = value.map((item, valueIndex) => (valueIndex === index ? text : item));
        onChange(newValue);
    };

    const handleChange = (text: string, index: number) => {
        onChangeValue(text, index);

        if (text.length > 0) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Backspace' && !value[index]) {
            inputRefs.current[index - 1]?.focus();
            onChangeValue('', index - 1);
        }
    };

    return (
        <div className="otpContainer">
            {[...Array(length)].map((_, index) => (
                <input
                    ref={ref => {
                        if (ref && !inputRefs.current.includes(ref)) {
                            inputRefs.current.push(ref);
                        }
                    }}
                    key={index}
                    maxLength={1} 
                    disabled={disabled} 
                    className="input" 
                    type="text" 
                    value={value[index]} 
                    onChange={e => handleChange(e.target.value, index)}
                    onKeyDown={event => handleKeyPress(event, index)}
                    data-testid={`OTPInput-${index}`} 
                    aria-label={`OTP Input ${index + 1}`} 
                />
            ))}
        </div>
    );
};
