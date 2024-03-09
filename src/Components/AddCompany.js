import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const AddUserForm = () => {
    const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [formData, setFormData] = useState({
    CompanyName: '',
    CompanyAddress: '',
    Pincode:'',
    City:'',
    State:'',
    MobileNo:'',
    EmailId:'',
    ShortDescription:'',
    Is_Active: Boolean,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeStatus = () => {
    // Update the local state
    setStatus(!status);

    // Update the form data with the new status
    setFormData(formData.Is_Active=!status)
    
    setFormData(formData);
    console.log(!status);
    // You can use formData in your form submission logic
    console.log('Updated form data:', formData);
  };
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
      const response = await api.post('http://182.18.144.204:50019/Company/Add', formData);
      toast.success("Item added successfully")
      console.log('User added successfully:', response.data);

      // Reset form fields after successful submission
      setFormData({
        CompanyName: '',
        CompanyAddress: '',
        Pincode:'',
        City:'',
        State:'',
        MobileNo:'',
        EmailId:'',
        ShortDescription:'',
        Is_Active: Boolean,
      });
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
      setStatus(false);
    }
  };

  const handleBack =()=>{
    navigate(-1);
  }

  return (
    <div className="container mx-auto pt-10 mt-20 h-screen">
      <h2 className="text-3xl font-semibold mb-4">Add Company</h2>
      <form onSubmit={handleSubmit} className="bg-gray-200 shadow-md rounded-md p-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 mb-5">
    
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="CompanyName">
            Company Name
          </label>
          <input
            type="text"
            id="CompanyName"
            name="CompanyName"
            value={formData.CompanyName}
            onChange={handleChange}
            placeholder="Enter Company Name"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="CompanyAddress">
             Address
          </label>
          <input
            type="text"
            id="CompanyAddress"
            name="CompanyAddress"
            value={formData.CompanyAddress}
            onChange={handleChange}
            placeholder="Enter Company Address"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Pincode">
                Pincode
          </label>
          <input
            type="text"
            id="Pincode"
            name="Pincode"
            value={formData.Pincode}
            onChange={handleChange}
            placeholder="Enter Pincode"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="State">
                State
          </label>
          <input
            type="text"
            id="State"
            name="State"
            value={formData.State}
            onChange={handleChange}
            placeholder="Enter State"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="MobileNo">
            Phone No
          </label>
          <input
            type="text"
            id="MobileNo"
            name="MobileNo"
            value={formData.MobileNo}
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="EmailId">
                Email Id
          </label>
          <input
            type="text"
            id="EmailId"
            name="EmailId"
            value={formData.EmailId}
            onChange={handleChange}
            placeholder="Enter Email Id"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ShortDescription">
                Short Description
          </label>
          <input
            type="text"
            id="ShortDescription"
            name="ShortDescription"
            value={formData.ShortDescription}
            onChange={handleChange}
            placeholder="Enter Short Description"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        </div>
        
        <label htmlFor="Is_Active" className='text-center justify-start flex items-center gap-x-5'>
          Status:
        <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={status}
          onChange={onChangeStatus}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer relative peer-focus:ring-4  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-black">
          {status ? 'Active' : 'Inactive'}
        </span>
      </label>
      </label>

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

export default AddUserForm;
