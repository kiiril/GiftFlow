import React from "react"
import axios from "axios";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    login() {
        // TODO: make data validation before sending to server
        axios.post("http://localhost:8108/users/login", {
            username: this.state.username,
            password: this.state.password
        }).then(function (response) {
            console.log("Sent data to server...");
            console.log(response);
            console.log(response.status);

            if (response.status === 200) {
                console.log(response.data);
                console.log("WE ARE SUCCESSFUL!!");
            } else {
                console.log("Something goes wrong");
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    retrieveText(e) {
        this.setState({[e.target.name]: e.target.value});
        console.log(this.state);
    }
    render() {
        return (
            <div>
                <form>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input name="username" type="text" className="form-control" id="username" onChange={(e) => this.retrieveText(e)}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input name="password" type="password" className="form-control" id="password" onChange={(e) => this.retrieveText(e)}/>
                    </div>

                    <div>
                        <button className="btn btn-primary" type="submit" onClick={() => this.login()}>Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;