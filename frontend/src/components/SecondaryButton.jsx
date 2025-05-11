import React from 'react';

const SecondaryButton = (
    {
        text="Button",
        backgroundColor = "transparent",
        textColor = "#141413",
        className="fs-5 fw-bold px-4 py-2",
        ...rest
    }) => {
    return (
        <a
            className={`secondary-button ${className}`}
            style={{backgroundColor: backgroundColor, color: textColor}}
            {...rest}
        >
            {text}
        </a>
    );
};

export default SecondaryButton;