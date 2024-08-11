import React, {useState} from 'react';
import SubmitButton from "../components/SubmitButton";
import Logo from "../components/Logo";
import axios from "axios";

const Signup = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const createUser = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/users", user);
        console.log(response);
    }

    return (
        <div className="d-flex align-items-center justify-content-center mt-4">
            {/*<Logo/>*/}
            <form onSubmit={createUser}>
                <h1 className="mt-5 mb-4 text-center">Signup</h1>
                <div className="mb-4">
                    <input className="form-control" value={user.email} onChange={e => setUser({...user, email: e.target.value})} type="email" placeholder="Email"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" value={user.password} onChange={e => setUser({...user, password: e.target.value})} type="password" placeholder="Create password"/>
                </div>
                <div className="mb-4">
                    <input className="form-control" type="password" placeholder="Confirm password"/>
                </div>
                <div className="mb-4">
                    <SubmitButton textColor="white" backgroundColor={"#F9AE01"}>Signup</SubmitButton>
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