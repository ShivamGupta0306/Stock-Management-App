import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import api from './Api';

const EditUserForm = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    Firstname: '',
    Lastname: '',
    Username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNo: '',
    isActive: false,
    userId:userId
  });
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.post(`http://182.18.144.204:50019/auth/userbyid`, { userId });
        const fetchedUser = response.data.result.Table[0]; // Assuming it's an array and we take the first item
        if (fetchedUser) {
          setUser((prevUser) => ({
            ...prevUser,
            Firstname: fetchedUser?.Firstname || '',
            Lastname: fetchedUser?.Lastname || '',
            Username: fetchedUser?.Username || '',
            password: fetchedUser?.Password || '',
            confirmPassword: fetchedUser?.Password || '',
            email: fetchedUser?.Email || '',
            phoneNo: fetchedUser?.phoneNo || '',
            isActive: fetchedUser?.isActive || false,
          }));
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);
  

  const handleInputChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleToggleChange = () => { 
    setUser((prevUser) => ({
      ...prevUser,
      isActive: !prevUser.isActive,
    }));
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(`http://182.18.144.204:50019/auth/update`, user);
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success("User details updated successfully");
        navigate('/user-list');
      }, 500);
      console.log(user);
    } catch (error) {
      console.error('Error updating user details', error);
    } finally {
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other UI for loading
  }

  return (
    <div className='h-screen'>
    <div className="container text-lg mx-auto pt-10 mt-20">
      <h2 className="text-3xl font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">First Name:</label>
          <input
            type="text"
            name="Firstname"
            value={user.Firstname}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Last Name:</label>
          <input
            type="text"
            name="Lastname"
            value={user.Lastname}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Username:</label>
          <input
            type="text"
            name="Username"
            value={user.Username}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            className={`transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none ${
              passwordError ? 'border-red-500' : 'focus:border-blue-500'
            }`}
            required
          />
          {passwordError && (
            <p className="text-red-500 mt-1">{passwordError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email ? user.email : "Not available"}
            onChange={handleInputChange}
            placeholder="Enter email"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Phone Number:</label>
          <input
            type="text"
            name="phoneNo"
            value={user.phoneNo ? user.phoneNo : "0000"}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex justify-center items-center gap-x-3">
          <label className=" text-white font-bold">Status:</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={user.isActive}
              onChange={handleToggleChange}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer relative peer-focus:ring-4  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 font-medium text-white dark:text-white">
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>
        <div className="mt-4 w-full flex justify-center items-center gap-x-4  col-span-2">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating User...' : 'Save Changes'}
          </button>
          <Link to='/user-list'>
          <button className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
    </div>
  );
};

export default EditUserForm;
