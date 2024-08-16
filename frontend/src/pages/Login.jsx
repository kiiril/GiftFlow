import React, {useContext, useEffect, useState} from 'react';
import Logo from "../components/Logo";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext, AuthProvider} from "../contexts/AuthProvider";

const Login = () => {
    const navigate = useNavigate();
    const {login, getUserCookies, removeUserCookies} = useContext(AuthContext);

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        // setInputs(getUserCookies())
        removeUserCookies(); // FIXME just instead logout for now
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(inputs);
        navigate("/"); // TODO: check how to handle this redirection
    }

    const handleChange = async (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="d-flex align-items-center justify-content-center mt-4">
            <form onSubmit={handleSubmit}>
                {/*<Logo/>*/}
                <h1 className="mt-5 mb-4 text-center">Login</h1>
                <div className="mb-4">
                    <input className="form-control" name="email" value={inputs.email} onChange={handleChange} type="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" name="password" value={inputs.password} onChange={handleChange} type="password" placeholder="Password"/>
                </div>
                <div className="text-center mb-4">
                    <a href="#" className="text-decoration-none">Forgot password?</a>
                </div>
                <div className="mb-4">
                    <SubmitButton textColor={"white"} backgroundColor={"#009951"}>Login</SubmitButton>
                </div>
                <p className="text-center">
                    Don't have an account?
                    <Link to={"/signup"} className="text-decoration-none"> Signup</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;