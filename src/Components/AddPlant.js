import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import api from './Api';

const AddPlant = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(false);
    const[company, setCompany] = useState([]);
    const [selectedCompanyCode, setSelectedCompanyCode] = useState('');

  const [formData, setFormData] = useState({
    Plant_Name: '',
    Address_Line1: '',
    Pincode:'',
    City:'',
    Contact_Person:'',
    Phone_Number:'',
    Email_Address:'',
    Other_Code:'',
    Is_Active: Boolean,
  });

  useEffect(()=>{
    async function fetchCompany(){
        try{
            const response = await api.post('http://182.18.144.204:50019/Company/Get', {});
            setCompany(response.data.result.Table);
        }
        catch(err){
            console.error(err);
        }
    }  
    
    fetchCompany();
  },[])

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeStatus = () => {
    // Update the local state
    setStatus(!status);

    // Update the form data with the new status
    setFormData(formData.Is_Active=!status)
    
    setFormData(formData);
    console.log(!status);
    // You can use formData in your form submission logic
    console.log(selectedCompanyCode)
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
        const formDataWithCompany = {
            ...formData,
            CompanyCode: selectedCompanyCode,
          };
      // Replace 'API_ENDPOINT' with your actual API endpoint
      const response = await api.post('http://182.18.144.204:50019/plant/add', formDataWithCompany);
      toast.success("Item added successfully")
      console.log('User added successfully:', response.data);

      // Reset form fields after successful submission
      setFormData({
        Plant_Name: '',
        Address_Line1: '',
        Pincode:'',
        City:'',
        Contact_Person:'',
        Phone_Number:'',
        Email_Address:'',
        Other_Code:'',
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


  const colourOptions = company.map((company) => ({
    value: company.CompanyCode,
    label: company.CompanyName
  }));
  

  return (
    <div className="container mx-auto pt-10 mt-20 h-screen lg:h-full mb-5">
      <h2 className="text-3xl font-semibold mb-4">Add Plant</h2>
      
      <form onSubmit={handleSubmit} className="bg-gray-200 shadow-md rounded-md p-6 max-w-2xl mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 mb-5">
      <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="CompanyCode">
            Company Name
    </label>
      <Select
        className="basic-single "
        classNamePrefix="select"
        name="CompanyCode"
        options={colourOptions}
        value={colourOptions.find(option => option.value === selectedCompanyCode)}
        onChange={(selectedOption) => setSelectedCompanyCode(selectedOption.value)}
      />
      </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Plant_Name">
            Plant Name
          </label>
          <input
            type="text"
            id="Plant_Name"
            name="Plant_Name"
            value={formData.Plant_Name}
            onChange={handleChange}
            placeholder="Enter Plant Name"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Address_Line1">
             Address
          </label>
          <input
            type="text"
            id="Address_Line1"
            name="Address_Line1"
            value={formData.Address_Line1}
            onChange={handleChange}
            placeholder="Enter Address"
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
            pattern="[0-9]*"
            onKeyDown={(e) => {
              if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
                e.preventDefault();
              }
            }} 
            placeholder="Enter Pincode"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Contact_Person">
            Contact Person
          </label>
          <input
            type="text"
            id="Contact_Person"
            name="Contact_Person"
            value={formData.Contact_Person}
            onChange={handleChange}
            placeholder="Enter Contact Person"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Phone_Number">
            Phone No
          </label>
          <input
            type="text"
            id="Phone_Number"
            name="Phone_Number"
            value={formData.Phone_Number}
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email_Address">
                Email Id
          </label>
          <input
            type="text"
            id="Email_Address"
            name="Email_Address"
            value={formData.Email_Address}
            onChange={handleChange}
            placeholder="Enter Email Id"
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
            pattern="[0-9]*"
            onKeyDown={(e) => {
              if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
                e.preventDefault();
              }
            }} 
            placeholder="Enter Other Code"
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

export default AddPlant;
