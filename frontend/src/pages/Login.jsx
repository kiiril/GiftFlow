import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";
import PrimaryButton from "../components/PrimaryButton";

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
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            {/* LOGO */}
            {/*<img src="/logo.png" alt="Logo"/>*/}
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                        <div className="bg-white rounded-4 shadow-sm">
                            <div className="p-4">
                                <h1 className="fw-bold fs-3 mb-4 text-center">
                                    Sign in to your account
                                </h1>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-bold">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-control py-2"
                                            placeholder="example@gmail.com"
                                            value={inputs.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-bold">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control py-2"
                                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                            value={inputs.password}
                                            onChange={handleChange}
                                            minLength={8}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <PrimaryButton
                                            backgroundColor={"#91B58B"}
                                            className={"w-100"}
                                        >
                                            Login
                                        </PrimaryButton>
                                    </div>

                                    <p className="text-center mb-0">
                                        Don’t have an account?{" "}
                                        <Link to="/signup" className="text-decoration-none">
                                            Signup
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;