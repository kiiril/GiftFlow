import {Navigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthProvider";
import {useContext} from "react";

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;