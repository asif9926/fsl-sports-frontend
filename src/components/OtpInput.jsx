import React, { useRef, useState } from 'react';

// ============================================
// 🔢 Professional 6-Box OTP Input Component
// window.prompt() replace করবে এটা
// ============================================
const OtpInput = ({ length = 6, onChange, disabled = false }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        // শুধু number accept করবে
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // শুধু last character রাখো
        setOtp(newOtp);

        const otpString = newOtp.join('');
        onChange(otpString);

        // পরের box-এ automatically focus যাবে
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace দিলে আগের box-এ যাবে
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        if (!pastedData) return;

        const newOtp = [...otp];
        for (let i = 0; i < length; i++) {
            newOtp[i] = pastedData[i] || '';
        }
        setOtp(newOtp);
        onChange(newOtp.join(''));

        // Last filled box-এ focus দাও
        const lastIndex = Math.min(pastedData.length - 1, length - 1);
        inputRefs.current[lastIndex]?.focus();
    };

    return (
        <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`
                        w-12 h-14 text-center text-xl font-bold
                        border-2 rounded-xl transition-all duration-200
                        focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                        ${digit ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-gray-50 text-gray-800'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}
                    `}
                />
            ))}
        </div>
    );
};

export default OtpInput;