import React, {useContext, useEffect, useState} from 'react';
import Logo from "../components/Logo";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext, AuthProvider} from "../contexts/AuthProvider";

const Login = () => {
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

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
        <div className="d-flex flex-column align-items-center justify-content-center p-5 mx-auto vh-100">
            {/* LOGO */}
            <img src="/logo.png" alt="Logo"/>

            <div className="w-50 bg-white rounded-4 shadow">
                <div className="p-4">

                    <h1 className="fw-bold fs-3 lh-sm mt-3 mb-4">Sign in to your account</h1>

                    <form className="mt-3" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Your email</label>
                            <input className="form-control"
                                   name="email"
                                   value={inputs.email}
                                   onChange={handleChange}
                                   type="email"
                                   placeholder="example@gmail.com"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input className="form-control"
                                   name="password"
                                   value={inputs.password}
                                   onChange={handleChange}
                                   type="password"
                                   placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            />
                            <div id="passwordHelp" className="form-text">Must have at least 8 characters.</div>
                        </div>

                        <SubmitButton textColor={"white"} backgroundColor={"#009951"} className={"mb-4"}>Login</SubmitButton>

                        <p className="text-center">
                            Don't have an account?
                            <Link to={"/signup"} className="text-decoration-none"> Signup</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;