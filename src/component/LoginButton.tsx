import React from 'react';
import axios from 'axios';

const LoginButton = () => {
    const handleLogin = async () => {
        try {
            const res = await axios.get('http://localhost:3001/auth/google/url');
            window.location.href = res.data.url;  // Redirect to Google OAuth page
        } catch (error) {
            console.error('Error initiating login:', error);
        }
    };
    

  return (
    <button onClick={handleLogin}>Login with Google</button>
  );
};

export default LoginButton;
