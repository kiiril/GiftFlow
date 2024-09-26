import React from 'react';

const SubmitButton = ({children, textColor, backgroundColor, className}) => {
    const completeStyle = `btn my-btn btn-shadow border border-2 border-dark fw-bold py-2 w-100 h-100 ${className}`;
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