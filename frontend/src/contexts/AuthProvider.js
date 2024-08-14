import {createContext, useState} from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState({
        id: null, // FIXME mb bad
        email: null,
        name: null,
        surname: null,
        gender: null,
        dateOfBirthday: null
    });

    const login = async () => {
        const response = await axios.post("http://localhost:8080/users/login", user);
        if (response.status === 200) {
            console.log("Response: ", response)
            setIsAuth(true);
            setUser(response.data);
        }
        return response.data;
    }

    const signup = async () => {
        const response = await axios.post("http://localhost:8080/users/signup", user);
        if (response.status === 200) {
            await login();
        }
        return response.data;
    }

    // FIXME this is not working
    const logout = async () => {
        const response = await axios.post("http://localhost:8080/users/logout");
        if (response.status === 200) {
            setIsAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{isAuth, setIsAuth, user, setUser, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    );
}