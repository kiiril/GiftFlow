import React from 'react';

const TopicTag = ({color, children}) => {
    return (
        <div
            className="rounded-2 text-center p-1 mx-1 flex-grow-1"
            style={{backgroundColor: color}}
        >
            {children}
        </div>
    );
};

export default TopicTag;