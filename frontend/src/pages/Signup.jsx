import React, {useState} from 'react';
import SubmitButton from "../components/SubmitButton";
import Logo from "../components/Logo";
import axios from "axios";
import {Link} from "react-router-dom";

const Signup = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/users", user);
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