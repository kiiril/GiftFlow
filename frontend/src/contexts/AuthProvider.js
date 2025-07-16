import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Important to avoid flashing redirects

    useEffect(() => {
        axios
            .get('http://localhost:8080/users/me', { withCredentials: true })
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
            const response = await axios.post("http://localhost:8080/auth/signup", { username, email, password }, {withCredentials: true});
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
            const response = await axios.post("http://localhost:8080/auth/login", { email, password }, {withCredentials: true});
            if (response.status === 200) {
                setUser(response.data);
                return response.data;
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, loading }}>
            {children}
        </AuthContext.Provider>
    );
};