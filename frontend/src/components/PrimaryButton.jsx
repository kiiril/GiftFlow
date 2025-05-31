import React from 'react';

const PrimaryButton = (
    {
        text="Button",
        backgroundColor = "#CB785C",
        textColor = "#FFFFFF",
        className,
    }) => {
    return (
        <a
            className={`primary-button fs-5 fw-bold px-4 py-2 ${className}`}
            style={{backgroundColor: backgroundColor, color: textColor}}
        >
            {text}
        </a>
    );
};

export default PrimaryButton;