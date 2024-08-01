import React from 'react';

const Rating = () => {
    const [value, setValue] = React.useState(0);
    return (
        <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
        />
    );
};

export default Rating;