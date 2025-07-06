import React, {useState} from 'react';

const SecondaryButton = (
    {
        text="Button",
        backgroundColor = "transparent",
        textColor = "#2C3E50",
        onHoverTextColor = "#2C3E50",
        onHoverBackgroundColor = "#EBDBBC",
        className,
        onClick,
        ...rest
    }) => {
    const [hover, setHover] = useState(false);

    // fixme: temporal solution
    const hasPyOverride = /\bpy-\d\b/.test(className);
    const paddingClass = hasPyOverride ? "" : "py-2";

    return (
        <a
            role={"button"}
            className={`secondary-button fs-5 fw-bold px-4 ${paddingClass} ${className}`}
            style={{
                backgroundColor: hover ? onHoverBackgroundColor : backgroundColor,
                color: hover ? onHoverTextColor : textColor,
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            {...rest}
        >
            {text}
        </a>
    );
};

export default SecondaryButton;