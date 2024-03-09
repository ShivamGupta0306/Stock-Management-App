import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './Loading';
import '../App.css';
import api from './Api';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const storeddata = JSON.parse(localStorage.getItem('savedCredentials'));
    const storedUsername = storeddata?.username;

    const fetchUserData = async () => {
      try {
        const response = await api.post(`/auth/userbyid`, { "Username": storedUsername });
        
        // Check if the response has the expected structure
        if (response.data && response.data.result && response.data.result.Table && response.data.result.Table.length > 0) {
          // const userData = ;
          setLoading(false);
          setUserData(response.data.result.Table[0]);
        } else {
          setLoading(false);
          // Handle the case where user data is not available
          console.error('User data not available:', response.data);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching user data:', error);
      }
    };
  
    if (storedUsername) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasswordChange = async () => {
    try {
      const user = userData;
      user.Password = newPassword;
      console.log(user);
      const response = await api.post('http://182.18.144.204:50019/auth/update', user);
      console.log('Password updated in the database:', response.data);
      const storedData = JSON.parse(localStorage.getItem('savedCredentials'));
      storedData.password = newPassword;
      localStorage.setItem('savedCredentials', JSON.stringify(storedData));
      setIsEditingPassword(false); // Close the password edit section after updating
    } catch (error) {
      console.error('Error updating password in the database:', error);
    }
  };

  const getStatusColor = () => {
    return userData?.isActive ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      {loading ? (<Loading/>) : (
        <div className="bg-white shadow-md p-8 rounded-md w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl transform scale-95 hover:scale-100 transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-center mt-3 mb-4">
            <img
              src="https://via.placeholder.com/96"
              alt="User Avatar"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <h2 className="text-3xl font-semibold mb-5 text-center">User Profile</h2>
          <div className="space-y-2 mt-10 text-xl">
            <p>
              <span className="font-semibold">First Name:</span> {userData?.Username || 'Not Available'}
            </p>
            <p>
              <span className="font-semibold">Last Name:</span> {userData?.Lastname || 'Not Available'}
            </p>
            <p>
              <span className="font-semibold">Registration Date:</span> {userData?.RegistrationDate || 'Not Available'}
            </p>
            <p className={`${getStatusColor()} font-semibold`}>
              <span>Status:</span> {userData?.isActive ? 'Active' : 'Inactive'}
              <span className={`inline-block w-3 h-3 rounded-full ml-2 ${getStatusColor()}`}></span>
            </p>
            <p>
              <span className="font-semibold">Phone Number:</span> {userData?.phoneNo || 'Not Available'}
            </p>
            {isEditingPassword ? (
              <>
                
                <div className="flex justify-center space-x-4 items-center pt-8">
                <label className="block mb-2 text-xl font-semibold">New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded-md p-2 mb-4"
                />
                  <button
                    onClick={handlePasswordChange}
                    className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setIsEditingPassword(false)}
                    className="bg-gray-500 text-white text-sm px-2 py-1 rounded-md ml-4 hover:bg-gray-700 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="bg-blue-500 text-white px-2 py-1 m-8 rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Edit Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
