import './App.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostCard from "./components/PostCard";
import React from "react";
import FilterBar from "./components/FilterBar";
import Profile from "./pages/Profile";
import ScrollFeed from "./components/ScrollFeed";
import Landing from "./components/Landing";
import Main from "./pages/Main";
import Account from "./components/Account";
import {AuthProvider} from "./contexts/AuthProvider";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Error from "./pages/Error";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Account/>,
            errorElement: <Error/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/signup",
            element: <Signup/>
        }
    ])

    return (
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    );
}

export default App;
