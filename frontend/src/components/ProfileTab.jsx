import React from 'react';

const ProfileTab = ({label, active, children}) => {
    const className = `nav-link rounded-pill fw-bold text-black fs-5 w-100 mx-3 my-3 ${active ? 'active' : ''}`;
    return (
        <button
            className={className}
            id={`v-pills-${label}-tab`}
            data-bs-target={`#v-pills-${label}`}
            aria-controls={`v-pills-${label}`}
            type="button"
            role="tab"
            data-bs-toggle="pill"
            aria-selected="true"
        >
            {children}
        </button>
    );
};

export default ProfileTab;