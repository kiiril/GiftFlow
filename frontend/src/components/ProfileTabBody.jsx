import React from 'react';

const ProfileTabBody = ({title, children}) => {
    return (
        <div className="tab-pane fade show" id={`v-pills-${title}`} role="tabpanel"
             aria-labelledby={`v-pills-${title}-tab`} tabIndex="0">
            {children}
        </div>
    );
};

export default ProfileTabBody;