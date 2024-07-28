import React from 'react';

const SubmitButton = ({color}) => {
    return (
        <button
            className="btn border border-dark btn-shadow text-white fw-bold w-100"
            type="submit"
            style={{backgroundColor: color}}
        >
            Login
        </button>
    );
};

export default SubmitButton;