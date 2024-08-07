import './App.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostCard from "./components/PostCard";
import React from "react";
import FilterBar from "./components/FilterBar";
import Profile from "./pages/Profile";

function App() {
    return (
        <div className="col-8 m-5">
            <PostCard/>
            <PostCard/>
            <PostCard/>
        </div>
    );
}

export default App;
