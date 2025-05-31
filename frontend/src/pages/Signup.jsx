import React, {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";
import PrimaryButton from "../components/PrimaryButton";

const Signup = () => {
    const navigate = useNavigate();
    const {signup} = useContext(AuthContext);

    const [inputs, setInputs] = useState({
        username: "",
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
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            {/* LOGO */}
            {/*<img src="/logo.png" alt="Logo"/>*/}

            <div className={"container"}>
                <div className="row justify-content-center">
                    <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                        <div className="bg-white rounded-4 shadow-sm">
                            <div className="p-4">
                                <h1 className="fw-bold fs-3 mb-4 text-center">
                                    Create account
                                </h1>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label fw-bold">Username</label>
                                        <input className="form-control"
                                               name="username"
                                               id="username"
                                               value={inputs.username}
                                               onChange={handleChange}
                                               type="email"
                                               placeholder="example"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-bold">Email</label>
                                        <input className="form-control"
                                               name="email"
                                               value={inputs.email}
                                               onChange={handleChange}
                                               type="email"
                                               placeholder="example@gmail.com"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-bold">Password</label>
                                        <input
                                            className="form-control"
                                           name="password"
                                           value={inputs.password}
                                           onChange={handleChange}
                                           type="password"
                                           placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                           minLength={8}
                                           required
                                        />
                                        <div id="passwordHelp" className="form-text">
                                            Must have at least 8 characters.
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <PrimaryButton
                                            text="Sign Up"
                                            className={"w-100"}
                                        />
                                    </div>

                                    <p className="text-center">
                                        Already have an account?
                                        <Link to={"/login"} className="text-decoration-none"> Log in</Link>
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

export default Signup;