import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import {API_BASE_URL} from "../constants";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Important to avoid flashing redirects

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/users/me`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch((e) => {
                console.error("Failed to fetch user data", e);
                setUser(null)
            })
            .finally(() => setLoading(false));
    }, []);

    // Signup function
    const signup = async ({username, email, password}) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, { username, email, password }, {withCredentials: true});
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
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, {withCredentials: true});
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
    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, {withCredentials: true});
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if the server request fails, we should clear the local user state
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};