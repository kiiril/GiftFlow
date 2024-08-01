import './App.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostCard from "./components/PostCard";
import React from "react";
import FilterBar from "./components/FilterBar";

function App() {
    return (
        <div>
            <FilterBar/>
            <Login/>
            <Signup/>
            <PostCard/>
        </div>
    );
}

export default App;
