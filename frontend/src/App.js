import React from "react";
import './App.css';
import Login from "./components/Login";

// main page component where we need to insert all other components
class App extends React.Component {
  render() {
    return (
        <div className="container">
            <Login />
        </div>
    );
  }
}

export default App;
