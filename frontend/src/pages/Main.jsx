import React from 'react';
import Landing from "../components/Landing";
import ScrollFeed from "../components/ScrollFeed";

const Main = () => {
    return (
        <div>
            <Landing/>
            <h1 className="ms-3 my-4">Let's specify your desires:</h1>
            <ScrollFeed/>
        </div>
    );
};

export default Main;