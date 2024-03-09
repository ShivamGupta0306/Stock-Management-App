import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import api from './Api';

const EditUserForm = () => {
  const { Center_Code } = useParams();
  console.log(Center_Code)
  const [user, setUser] = useState({
    Center_Code:Center_Code,
    Center_Name: '',
    Address: '',
    City:'',
    Phone_No:'',
    Other_Code:'',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.post(`http://182.18.144.204:50019/bmc/bycode`, { Center_Code });
        console.log(response);
        const fetchedUser = response.data.result.Table[0]; // Assuming it's an array and we take the first item
        console.log(fetchedUser);
        if (fetchedUser) {
          setUser((prevUser) => ({
            ...prevUser,
            Center_Code:Center_Code,
            Center_Name: fetchedUser?.cntName || '',
            Address: fetchedUser?.Add1 || '',
            City: fetchedUser?.City || '',
            Phone_No: fetchedUser?.Phone_No || '',
            Other_Code: fetchedUser?.OtherCode || '',
          }));
        } else {
          console.error('Item not found');
        }
      } catch (error) {
        console.error('Error fetching user details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [Center_Code]);
  

  const handleInputChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleToggleChange = () => { 
    setUser((prevUser) => ({
      ...prevUser,
      Is_Active: !prevUser.Is_Active,
    }));
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await api.post(`http://182.18.144.204:50019/bmc/update`, user);
      console.log(user);
      toast.success("Item details updated successfully");
      navigate('/bmc-list');
    } catch (error) {
      console.error('Error updating user details', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other UI for loading
  }

  return (
    <>
    <div className="container mx-auto h-screen pt-10 mt-20">
      <h2 className="text-3xl font-semibold mb-4">Edit BMC</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">BMC Name:</label>
          <input
            type="text"
            name="Center_Name"
            value={user.Center_Name}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Address :</label>
          <input
            type="text"
            name="Address"
            value={user.Address}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">City :</label>
          <input
            type="text"
            name="City"
            value={user.City}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone No :</label>
          <input
            type="text"
            name="Phone_No"
            value={user.Phone_No}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Other Code :</label>
          <input
            type="text"
            name="Other_Code"
            value={user.Other_Code}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mt-6 col-span-2 flex gap-x-4">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating User...' : 'Save Changes'}
          </button>
          <Link to='/bmc-list'>
          <button className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditUserForm;
