import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const AddPlant = () => {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Center_Name: '',
    Address: '',
    City:'',
    Phone_No:'',
    Other_Code:'',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Replace 'API_ENDPOINT' with your actual API endpoint
      const response = await api.post('http://182.18.144.204:50019/bmc/add', formData);
      toast.success("Item added successfully")
      console.log('User added successfully:', response.data);

      // Reset form fields after successful submission
      setFormData({
        Center_Name: '',
        Address: '',
        City:'',
        Phone_No:'',
        Other_Code:''
      });
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack =()=>{
    navigate(-1);
  }
  

  return (
    <div className="container mx-auto pt-10 mt-20 h-screen">
      <h2 className="text-3xl font-semibold mb-4">Add BMC</h2>
      
      <form onSubmit={handleSubmit} className="bg-gray-200 shadow-md rounded-md p-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 mb-5">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Center_Name">
            BMC Name
          </label>
          <input
            type="text"
            id="Center_Name"
            name="Center_Name"
            value={formData.Center_Name}
            onChange={handleChange}
            placeholder="Enter Center Name"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Address">
             Address
          </label>
          <input
            type="text"
            id="Address"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            placeholder="Enter Address"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="City">
            City
          </label>
          <input
            type="text"
            id="City"
            name="City"
            value={formData.City}
            onChange={handleChange}
            placeholder="Enter City"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Phone_No">
            Phone No
          </label>
          <input
            type="text"
            id="Phone_No"
            name="Phone_No"
            value={formData.Phone_No}
            onChange={handleChange}
            placeholder="Enter Phone No"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
                e.preventDefault();
              }
            }} 
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Other_Code">
                Other Code
          </label>
          <input
            type="text"
            id="Other_Code"
            name="Other_Code"
            value={formData.Other_Code}
            onChange={handleChange}
            placeholder="Enter Other Code"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
                e.preventDefault();
              }
            }} 
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        </div>

        <div className="mt-6 w-full flex justify-start items-center gap-x-4  col-span-2">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding User...' : 'Add Item'}
          </button>
          <button onClick={handleBack} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlant;
