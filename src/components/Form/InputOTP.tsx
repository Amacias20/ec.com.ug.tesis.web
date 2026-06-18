import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';

interface InputOTPProps {
    length: number;
    onChange?: (value: string) => void;
    error?: boolean;
    maskChar?: string;
    showNumbers?: boolean;
}

const InputOTP: React.FC<InputOTPProps> = ({ length, onChange, error, maskChar = '•', showNumbers = true }) => {
    const [codes, setCodes] = useState<string[]>(Array(length).fill(''));
    const [displayValues, setDisplayValues] = useState<string[]>(Array(length).fill(''));

    useEffect(() => {
        if (!showNumbers && maskChar) {
            setDisplayValues(codes.map(code => code ? maskChar : ''));
        } else {
            setDisplayValues(codes);
        }
    }, [codes, maskChar, showNumbers]);

    const handleCodeChange = (index: number, value: string) => {
        const regex = /^[0-9]*$/;
        if (value.length === 1 && regex.test(value)) {
            const newCodes = [...codes];
            newCodes[index] = value;
            setCodes(newCodes);
            if (index < codes.length - 1) {
                const nextInput = document.getElementById(`code${index + 1}`);
                if (nextInput instanceof HTMLInputElement) nextInput.focus();
            }
        } else {
            const newCodes = [...codes];
            newCodes[index] = '';
            setCodes(newCodes);
        }
    };

    const handleChange = (index: number, value: string) => {
        let newCodes = [...codes];
        newCodes[index] = value;
        setCodes(newCodes);
        handleCodeChange(index, value);

        if (onChange) {
            onChange(newCodes.join(''));
        }

        let newDisplayValues = [...displayValues];
        newDisplayValues[index] = showNumbers ? value : (maskChar ? maskChar : value);
        setDisplayValues(newDisplayValues);
    };

    const handleFocus = (index: number) => {
        let newDisplayValues = [...displayValues];
        newDisplayValues[index] = showNumbers ? codes[index] : '';
        setDisplayValues(newDisplayValues);
    };

    const handleBlur = (index: number) => {
        let newDisplayValues = [...displayValues];
        newDisplayValues[index] = codes[index] ? (showNumbers ? codes[index] : maskChar) : '';
        setDisplayValues(newDisplayValues);
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && codes[index] === '' && index > 0) {
            const prevInput = document.getElementById(`code${index - 1}`);
            if (prevInput instanceof HTMLInputElement) prevInput.focus();

            let newCodes = [...codes];
            newCodes[index - 1] = '';
            setCodes(newCodes);

            let newDisplayValues = [...displayValues];
            newDisplayValues[index - 1] = '';
            setDisplayValues(newDisplayValues);

            if (onChange) {
                onChange(newCodes.join(''));
            }
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        const regex = /^[0-9]*$/;

        if (regex.test(pasteData)) {
            const pasteArray = pasteData.split('').slice(0, length);
            let newCodes = [...codes];
            pasteArray.forEach((char, index) => {
                newCodes[index] = char;
            });
            setCodes(newCodes);

            if (onChange) {
                onChange(newCodes.join(''));
            }

            let newDisplayValues = pasteArray.map(value => showNumbers ? value : (maskChar ? maskChar : value));
            setDisplayValues(newDisplayValues);

            const nextIndex = pasteArray.length;
            if (nextIndex < length) {
                const nextInput = document.getElementById(`code${nextIndex}`);
                if (nextInput instanceof HTMLInputElement) nextInput.focus();
            }
        }
    };

    return (
        <div style={{ justifyContent: 'center', textAlign: 'center' }} className={error ? 'shake-animation' : ''}>
            {Array.from({ length }, (_, index) => (
                <InputText
                    id={`code${index}`}
                    key={index}
                    value={displayValues[index]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                    onFocus={() => handleFocus(index)}
                    onBlur={() => handleBlur(index)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    autoComplete='off'
                    style={{
                        width: '2.7rem',
                        height: '2.7rem',
                        marginRight: '0.3rem',
                        textAlign: 'center',
                    }}
                    maxLength={1}
                    className={error ? 'shake-animation' : ''}
                />
            ))}
        </div>
    );
};

export default InputOTP;
