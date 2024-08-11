import React, {useState} from 'react';
import Logo from "../components/Logo";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/users/login", user);
        console.log(response);
    }
    return (
        <div className="d-flex align-items-center justify-content-center mt-4">
            <form onSubmit={handleLogin}>
                {/*<Logo/>*/}
                <h1 className="mt-5 mb-4 text-center">Login</h1>
                <div className="mb-4">
                    <input className="form-control" value={user.email} onChange={e => setUser({...user, email: e.target.value})} type="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" value={user.password} onChange={e => setUser({...user, password: e.target.value})} type="password" placeholder="Password"/>
                </div>
                <div className="text-center mb-4">
                    <a href="#" className="text-decoration-none">Forgot password?</a>
                </div>
                <div className="mb-4">
                    <SubmitButton textColor={"white"} backgroundColor={"#009951"}>Login</SubmitButton>
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