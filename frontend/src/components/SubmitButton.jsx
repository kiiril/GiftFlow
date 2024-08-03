import React from 'react';

const SubmitButton = ({children, textColor, backgroundColor, className}) => {
    const completeStyle = `btn border border-dark btn-shadow fw-bold w-100 ${className}`;
    return (
        <button
            className={completeStyle}
            type="submit"
            style={{backgroundColor: backgroundColor, color: textColor}}
        >
            {children}
        </button>
    );
};

export default SubmitButton;