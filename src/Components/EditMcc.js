import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import api from './Api';

const EditUserForm = () => {
  const { MCC_Id } = useParams();
  console.log(MCC_Id)
  const [user, setUser] = useState({
    MCC_Id:MCC_Id,
    MCC_Name: '',
    Address_Line1: '',
    Pincode:'',
    City:'',
    Contact_Person:'',
    Phone_Number:'',
    Email_Address:'',
    Other_Code:'',
    Is_Active: Boolean,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.post(`http://182.18.144.204:50019/mcc/bycode`, { MCC_Id });
        console.log(response);
        const fetchedUser = response.data.result.Table[0]; // Assuming it's an array and we take the first item
        console.log(fetchedUser);
        if (fetchedUser) {
          setUser((prevUser) => ({
            ...prevUser,
            MCC_Id:MCC_Id,
            MCC_Name: fetchedUser?.MCC_Name || '',
            Address_Line1: fetchedUser?.Address_Line1 || '',
            Pincode: fetchedUser?.Pincode || '',
            City: fetchedUser?.City || '',
            Contact_Person: fetchedUser?.Contact_Person || '',
            Phone_Number: fetchedUser?.Phone_Number || '',
            Email_Address: fetchedUser?.Email_Address || '',
            Other_Code: fetchedUser?.Other_Code || '',
            Is_Active: fetchedUser?.Is_Active || false,
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
  }, [Plant_Id]);
  

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
      await api.post(`http://182.18.144.204:50019/plant/update`, user);
      console.log(user);
      toast.success("Item details updated successfully");
      navigate('/plant-list');
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
      <h2 className="text-3xl font-semibold mb-4">Edit Plant</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Plant Name:</label>
          <input
            type="text"
            name="Plant_Name"
            value={user.Plant_Name}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Address :</label>
          <input
            type="text"
            name="Address_Line1"
            value={user.Address_Line1}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Pincode :</label>
          <input
            type="text"
            name="Pincode"
            value={user.Pincode}
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Contact Person :</label>
          <input
            type="text"
            name="Contact_Person"
            value={user.Contact_Person}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone No :</label>
          <input
            type="text"
            name="Phone_Number"
            value={user.Phone_Number}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email Id :</label>
          <input
            type="text"
            name="Email_Address"
            value={user.Email_Address}
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
        
        <div className="mb-4 flex justify-start items-center gap-x-3">
          <label className=" text-gray-700 text-sm font-bold">Status:</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={user.Is_Active}
              onChange={handleToggleChange}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer relative peer-focus:ring-4  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-black">
              {user.Is_Active ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>
        <div className="mt-6 col-span-2 flex gap-x-4">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating User...' : 'Save Changes'}
          </button>
          <Link to='/plant-list'>
          <button className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditUserForm;
