import {createContext, useEffect, useState} from "react";
import axios from "axios";
import Cookies from "universal-cookie";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const cookies = new Cookies();

    const setUserCookies = (userData) => {
        cookies.set("user", userData, { path: '/', secure: true, sameSite: 'strict' });
    }

    const getUserCookies = () => {
        return cookies.get("user");
    }

    const removeUserCookies = () => {
        cookies.remove("user");
    }

    const login = async (inputs) => {
        const response = await axios.post("http://localhost:8080/users/login", inputs);
        if (response.status === 200) {
            setUserCookies({...response.data, isAuth: true});
        }
        return response.data;
    }

    const signup = async (inputs) => {
        const response = await axios.post("http://localhost:8080/users/signup", inputs);
        if (response.status === 200) {
            await login();
        }
        return response.data;
    }

    // FIXME this is not working
    const logout = async () => {
        // const response = await axios.post("http://localhost:8080/users/logout");
        // if (response.status === 200) {
        //     removeUserCookies();
        //     setIsAuth(false);
        // }
        removeUserCookies();
    }

    return (
        <AuthContext.Provider value={{getUserCookies, setUserCookies, removeUserCookies, cookies, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    );
}