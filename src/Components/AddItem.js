import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Select from 'react-select';
import styled from "styled-components";
import * as XLSX from 'xlsx';
import api from './Api';

const StyledCheckbox = styled.input`
  appearance: none;
  width: 1.2em;
  height: 1.2em;
  border: 2px solid #4a5568;
  border-radius: 0.25em;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 0.5em;

  &:checked {
    background-color: #4a5568;
  }

  &:checked::after {
    content: "";
    position: absolute;
    left: 0.4em;
    top: 0.2em;
    width: 0.25em;
    height: 0.5em;
    border: solid white;
    border-width: 0 0.2em 0.2em 0;
    transform: rotate(45deg);
  }
`;

const AddUserForm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [Products, setProduct] = useState([]);
  const [include, setInclude] = useState(false);
  const [formData, setFormData] = useState({
    ItemName: '',
    ItemGroupCode:'',
    // include_serial_no: Boolean,
    IsActive: Boolean,
  });

  const [selectedItemGroup, setSelectedItemGroup] = useState(null);
  const [fileData, setFileData] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeStatus = () => {
    setStatus(!status);
    setFormData({
      ...formData,
      IsActive: !status,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await api.post('http://182.18.144.204:50019/Product/getgroup', {});
        setProduct(response.data.result.Table);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      console.log(formData)
      const response = await api.post('http://182.18.144.204:50019/product/add', formData);
      toast.success("Item added successfully");
      console.log('User added successfully:', response.data);

      setFormData({
        ItemName: '',
        ItemGroupCode: selectedItemGroup ? selectedItemGroup.value : '',
        // serialno: Boolean,
        IsActive: Boolean,
      });
      setSelectedItemGroup(null);
      setInclude(false);
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
      setStatus(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setFileData(excelData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const checkornot = () =>{
    setInclude(!include);
    setFormData({...formData, 
      include_serial_no: !include,
    })
  }

  const handle = (selectedOption) => {
    setSelectedItemGroup(selectedOption);
    setFormData({
      ...formData,
      ItemGroupCode: selectedOption ? selectedOption.value : null,
    });
  };
  

  const colourOptions = Products.map((Product) => ({
    value: Product.ItemMasterGroupCode,
    label: Product.ItemGroupName
  }));

  return (
    <div className="container mx-auto pt-10 mt-20 h-screen">
      <h2 className="text-3xl font-semibold mb-4">Add Item</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ItemGroupCode">
            Item-Group
          </label>
          <Select
            className="basic-single "
            classNamePrefix="select"
            name="ItemGroupCode"
            options={colourOptions}
            onChange={handle}
            value={selectedItemGroup}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileInput">
            Upload Excel Sheet
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ItemName">
            Item Name
          </label>
          <input
            type="text"
            id="ItemName"
            name="ItemName"
            value={formData.ItemName}
            onChange={handleChange}
            placeholder="Enter Item Name"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-start items-center flex-row gap-3 mb-4 mt-4">
          <label className="block text-gray-700 text-sm font-bold cursor-pointer" htmlFor="serialNumber">
            Include Serial Number
          </label>
          <StyledCheckbox
            type="checkbox"
            id="serialNumber"
            name="serialNumber"
            checked={include}
            onChange={checkornot}
          />
          {/* <span className="text-gray-700">Include Serial Number</span> */}
        </div>

        <label htmlFor="IsActive" className='text-center justify-start flex items-center gap-x-5'>
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
