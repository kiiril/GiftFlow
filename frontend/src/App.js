import './App.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import React from "react";
import Main from "./pages/Main";
import {AuthProvider} from "./contexts/AuthProvider";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Error from "./pages/Error";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import UserCalendar from "./pages/UserCalendar";
import MyPosts from "./pages/MyPosts";
import CreateEditPost from "./pages/CreateEditPost";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import {TagsProvider} from "./contexts/TagsProvider";
import RootLayout from "./components/RootLayout";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout/>,
            children: [
                {
                    element: <ProtectedRoutes/>,
                    children: [
                        {
                            path: "/profile",
                            element: <Profile/>
                        },
                        {
                            path: "/myposts",
                            element: <MyPosts/>
                        },
                    ]
                },
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
                    path: "/posts/:id",
                    element: <Post/>
                },
                {
                    path: "/calendar",
                    element: <UserCalendar/>
                },
                {
                    path: "/posts/new",
                    element: <CreateEditPost/>
                },
                {
                    path: "/posts/:postId/edit",
                    element: <CreateEditPost/>
                }
            ]
        },
    ]);

    return (
        <AuthProvider>
            <TagsProvider>
                <RouterProvider router={router}/>
            </TagsProvider>
        </AuthProvider>
    );
}

export default App;
