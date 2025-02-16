import './App.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import React from "react";
import Profile from "./pages/Profile";
import Main from "./pages/Main";
import {AuthProvider} from "./contexts/AuthProvider";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Error from "./pages/Error";
import Post from "./pages/Post";
import NewProfile from "./pages/NewProfile";
import Header from "./components/Header";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Main/>,
            errorElement: <Error/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/signup",
            element: <Signup/>
        },
        {
            path: "/profile",
            element: <Profile/>
        },
        {
            path: "/posts/:id",
            element: <Post/>
        },
        {
            path: "/newProfile",
            element: <NewProfile/>
        }
    ]);

    return (
        <AuthProvider>
            <div style={{backgroundColor: "var(--background-light)", width: "100vw", height: "100vh"}}>
                <Header/>
                <RouterProvider router={router}/>
            </div>
        </AuthProvider>
    );
}

export default App;
