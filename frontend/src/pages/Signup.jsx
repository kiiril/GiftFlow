import React from 'react';
import SubmitButton from "../components/SubmitButton";
import Logo from "../components/Logo";

const Signup = () => {
    return (
        <div className="d-flex align-items-center justify-content-center mt-4">
            {/*<Logo/>*/}
            <form>
                <h1 className="mt-5 mb-4 text-center">Signup</h1>
                <div className="mb-4">
                    <input className="form-control" type="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" type="password" placeholder="Create password"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" type="password" placeholder="Confirm password"/>
                </div>
                <div className="mb-4">
                    <SubmitButton color={"#F9AE01"}/>
                </div>
                <p className="text-center">
                    Already have an account?
                    <a href="#" className="text-decoration-none"> Login</a>
                </p>
            </form>
        </div>
    );
};

export default Signup;