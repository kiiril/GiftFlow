import React, {useState} from 'react';
import Logo from "../components/Logo";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import {Link} from "react-router-dom";

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/users/login", user);
        console.log(response);
    }

    const handleChange = async (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }
    return (
        <div className="d-flex align-items-center justify-content-center mt-4">
            <form onSubmit={handleSubmit}>
                {/*<Logo/>*/}
                <h1 className="mt-5 mb-4 text-center">Login</h1>
                <div className="mb-4">
                    <input className="form-control" name="email" value={user.email} onChange={handleChange} type="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" name="password" value={user.password} onChange={handleChange} type="password" placeholder="Password"/>
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