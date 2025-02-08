import React from 'react';
import ScrollFeed from "../components/ScrollFeed";
import Landing from "../components/Landing";

const Main = () => {
    return (
        <div style={{backgroundColor: "#fffcf4"}}>
            <Landing/>
            <h1 className="ms-5 ps-4">Let's specify your desires:</h1>
            <ScrollFeed/>
        </div>
    );
};

export default Main;