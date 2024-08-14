import React, {useContext, useState} from 'react';
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";

const Signup = () => {
    const navigate = useNavigate();
    const {signup, user, setUser} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        signup();
        navigate("/");
    }

    const handleChange = async (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="d-flex align-items-center justify-content-center mt-4">
            {/*<Logo/>*/}
            <form onSubmit={handleSubmit}>
                <h1 className="mt-5 mb-4 text-center">Signup</h1>
                <div className="mb-4">
                    <input className="form-control" name="email" value={user.email} onChange={handleChange} type="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" name="password" value={user.password} onChange={handleChange} type="password" placeholder="Create password"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" type="password" placeholder="Confirm password"/>
                </div>
                <div className="mb-4">
                    <SubmitButton textColor="white" backgroundColor={"#F9AE01"}>Signup</SubmitButton>
                </div>
                <p className="text-center">
                    Already have an account?
                    <Link to={"/login"} className="text-decoration-none"> Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;