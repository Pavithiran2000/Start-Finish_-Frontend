import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchToken, removeToken} from '../utils/tokenUtils'; 
import {jwtDecode} from 'jwt-decode';

interface RequireTokenProps {
    children?: React.ReactNode;
}

const RequireToken: React.FC<RequireTokenProps> = ({ children }) => {
    const token = fetchToken();
    const location = useLocation();
    useEffect(() => {
        const checkTokenExpiration = () => {
            if (token) {
                const decodedToken: any = jwtDecode(token); 
                console.log(decodedToken, decodedToken.exp);

                const currentTime = Date.now() / 1000;
                console.log(currentTime);
                if (decodedToken.exp && decodedToken.exp < currentTime) {
                        removeToken();
                        window.alert("token Expied. Signin Again");
                        window.location.reload();
                }
            }
        };

        checkTokenExpiration();
    }, [token]);
    if (!token) {
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default RequireToken;
