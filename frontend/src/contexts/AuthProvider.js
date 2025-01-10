import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds the authenticated user's information, fixme: probably not needed

    // Signup function
    const signup = async ({email, password}) => {
        try {
            const response = await axios.post("http://localhost:8080/users/signup", { email, password });
            if (response.status === 201) {
                setUser(response.data);
                return response.data;
            }
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };

    // Login function
    const login = async ({email, password}) => {
        try {
            const response = await axios.post("http://localhost:8080/users/login", { email, password });
            if (response.status === 200) {
                setUser(response.data);
                return response.data;
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    // Logout function
    // const logout = async () => {
    //     try {
    //         const response = await axios.post("http://localhost:8080/users/logout");
    //         if (response.status === 200) {
    //             setUser(null); // Clear user data
    //         }
    //     } catch (error) {
    //         console.error("Logout failed:", error);
    //         throw error;
    //     }
    // };

    // Check session on app load or page refresh
    // const checkSession = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:8080/users/me");
    //         if (response.status === 200) {
    //             setUser(response.data); // Set the logged-in user
    //         }
    //     } catch (error) {
    //         console.warn("No active session:", error);
    //         setUser(null);
    //     }
    // };

    // Run `checkSession` once when the app loads
    // useEffect(() => {
    //     checkSession();
    // }, []);

    return (
        <AuthContext.Provider value={{ user, signup, login }}>
            {children}
        </AuthContext.Provider>
    );
};