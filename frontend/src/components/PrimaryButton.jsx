import React from 'react';

const PrimaryButton = (
    {
        text="Button",
        backgroundColor = "#C24632",
        textColor = "#FFFFFF",
        className="text-center fs-5 px-4 py-2 me-3"
    }) => {
    return (
        <a
            className={`primary-button ${className}`}
            style={{backgroundColor: backgroundColor, color: textColor}}
        >
            {text}
        </a>
    );
};

export default PrimaryButton;