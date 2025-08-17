import {Outlet, Navigate} from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../contexts/AuthProvider";

const ProtectedRoutes = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Loading...</p>;

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;