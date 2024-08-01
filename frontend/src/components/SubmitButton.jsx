import React from 'react';

const SubmitButton = ({children, color}) => {
    return (
        <button
            className="btn border border-dark btn-shadow text-white fw-bold w-100"
            type="submit"
            style={{backgroundColor: color}}
        >
            {children}
        </button>
    );
};

export default SubmitButton;