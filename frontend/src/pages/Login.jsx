import React from 'react';
import Logo from "../components/Logo";
import SubmitButton from "../components/SubmitButton";

const Login = () => {
    return (
        <div className="d-flex align-items-center justify-content-center mt-4">
            <form>
                {/*<Logo/>*/}
                <h1 className="mt-5 mb-4 text-center">Login</h1>
                <div className="mb-4">
                    <input className="form-control" type="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" type="password" placeholder="Password"/>
                </div>
                <div className="text-center mb-4">
                    <a href="#" className="text-decoration-none">Forgot password?</a>
                </div>
                <div className="mb-4">
                    <SubmitButton color={"#009951"}>Login</SubmitButton>
                </div>
                <p className="text-center">
                    Don't have an account?
                    <a href="#" className="text-decoration-none"> Signup</a>
                </p>
            </form>
        </div>
    );
};

export default Login;