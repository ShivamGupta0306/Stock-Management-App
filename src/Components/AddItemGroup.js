import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const AddUserForm = () => {
    const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [formData, setFormData] = useState({
    ItemGroupName: '',
    ItemMasterGroupCode: '',
    isactive: Boolean,
  });
  const formRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileData, setFileData] = useState(null);

  const onChangeStatus = () => {
    // Update the local state
    setStatus(!status);

    // Update the form data with the new status
    setFormData(formData.isactive=!status)
    
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

      const jsonData = fileData.map(row => {
        return {
            ItemGroupName: row[0] // Assuming the first column is ItemName
            // ItemGroupCode: row[1], // Assuming the second column is ItemGroupCode
            // Add more fields as needed
        };
    });
      // Replace 'API_ENDPOINT' with your actual API endpoint
      const response = await api.post('http://182.18.144.204:50019/product/addgroup', jsonData);
      toast.success("Item added successfully")
      console.log('User added successfully:', response.data);

      // Reset form fields after successful submission
      setFormData({
        ItemGroupName: '',
        ItemMasterGroupCode: '',
        isactive: Boolean,
      });
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
      setStatus(false);
    }
  };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             const data = new Uint8Array(event.target.result);
//             const workbook = XLSX.read(data, { type: 'array' });
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];
//             const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//             setFileData(excelData);
            
//             // Automatically submit the form after choosing a file
//             if (formRef.current) {
//                 formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
//             }
//         };
//         reader.readAsArrayBuffer(file);
//     }
// };

  const handleBack =()=>{
    navigate(-1);
  }

  return (
    <div className="text- lg container mx-auto  pt-10 mt-20 min-h-screen h-full">
      <h2 className="text-3xl font-semibold  mb-8">Add Item Group</h2>
      <form onSubmit={handleSubmit} className="my-auto place-content-center  grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mt-8">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="ItemGroupName">
            Item Group Name
          </label>
          <input
            type="text"
            id="ItemGroupName"
            name="ItemGroupName"
            value={formData.ItemGroupName}
            onChange={handleChange}
            placeholder="Enter Item Group Name"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            // required
          />
        </div>

        


        {/* <div className="mt-8">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="ItemMasterGroupCode">
            Item Master Group Code
          </label>
          <input
            type="text"
            id="ItemMasterGroupCode"
            name="ItemMasterGroupCode"
            value={formData.ItemMasterGroupCode}
            onChange={handleChange}
            placeholder="Enter Item Group Code"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div> */}
        
        <label htmlFor="isactive" className='text-center w-full text-white justify-start flex items-center mt-14 gap-x-5'>
          Status:
        <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={status}
          onChange={onChangeStatus}
        />
        <div className="w-11 h-6  bg-gray-200 rounded-full peer relative peer-focus:ring-4  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-white dark:text-white">
          {status ? 'Active' : 'Inactive'}
        </span>
      </label>
      </label>

        <div className="mt-10 w-full flex justify-center items-center gap-x-4  col-span-2">
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
