import './App.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostCard from "./components/PostCard";
import React from "react";

function App() {
    return (
        <div>
            <Login/>
            <Signup/>
            <PostCard/>
            <PostCard/>
        </div>
    );
}

export default App;
