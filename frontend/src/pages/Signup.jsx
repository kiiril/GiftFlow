import React, {useContext, useState} from 'react';
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";

const Signup = () => {
    const navigate = useNavigate();
    const {signup} = useContext(AuthContext);

    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
        navigate("/");
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

                    <h1 className="fw-bold fs-3 lh-sm mt-3 mb-4">Create account</h1>

                    <form className="mt-3" onSubmit={handleSubmit}>
                        {/* TODO mb add fields for name and surname */}
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input className="form-control"
                                       name="firstName"
                                       value={inputs.firstName}
                                       onChange={handleChange}
                                       type="text"
                                       placeholder="John"
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input className="form-control"
                                       name="lastName"
                                       value={inputs.lastName}
                                       onChange={handleChange}
                                       type="text"
                                       placeholder="Doe"
                                />
                            </div>
                        </div>

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

                        <SubmitButton textColor={"white"} backgroundColor={"#ffd43b"} className={"mb-4"}>Signup</SubmitButton>

                        <p className="text-center">
                            Already have an account?
                            <Link to={"/login"} className="text-decoration-none"> Log in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;