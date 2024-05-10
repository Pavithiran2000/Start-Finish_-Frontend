import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


import Profile from './Pro';


interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
interface JwtPayload {
  userId: string;
}


function MyProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const token = localStorage.getItem('Token');
  if (!token) throw new Error('No token found');
  const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<UserProfile>(`http://localhost:3001/profile?userId=${decodedToken.userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchProfile();
  }, []);
 
  if (!profile) {
    return <h2 style={{marginTop:100}}>Loading...</h2>;
  }
  return (
    <Profile firstName={profile.firstName} lastName={profile.lastName} phoneNumber={profile.phoneNumber} email={profile.email}/>
  );
};
export default MyProfile;

