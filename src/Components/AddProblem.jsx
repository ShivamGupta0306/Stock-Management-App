import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Select from 'react-select';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import api from './Api';

const AddUserForm = () => {
    const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [Products, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [shownData, setShownData] = useState([]);
  const [formData, setFormData] = useState({
    ProductId: '',
    ProblemType: '',
  });
  const [updatedData, setUpdatedData] = useState({});

  const [editData, setEditData] = useState(null);


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async() =>{
    try{
        console.log(shownData)
        const response = await api.post('http://182.18.144.204:50019/problemtype/add', shownData);
        toast.success("Item added successfully");
        console.log('User added successfully:', response.data);
    } catch(err){
      console.error(err.message);
    }
  }

  useEffect(()=>{
    async function fetchCompany(){
        try{
            const response = await api.post('http://182.18.144.204:50019/problemtype/get', {});
            setProduct(response.data.result.Table);
        }
        catch(err){
            console.error(err);
        }
    }  
    
    fetchCompany();
  },[])

  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = shownData.slice(indexOfFirstUser, indexOfLastUser);

  const totalPageCount = Math.ceil(shownData.length / usersPerPage);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, index) => index + 1);

  const handleEntriesChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };

  const handleEdit = async (transaction) => {
    setEditData(transaction);
    setFormData({
      ProductId: transaction.ProductId,
      ProblemType: transaction.ProblemType,
    });
    // const response = await axios.post('http://182.18.144.204:50019/problemtype/update', updatedData);
    toast.success("Item added successfully")
      // console.log('User updated successfully:', response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Replace 'API_ENDPOINT' with your actual API endpoint
    //   console.log(formData);
    let response;
    if (editData) {
      const updatedEditData = {
        ...editData,
        ProductId: formData.ProductId,
        ProblemType: formData.ProblemType,
        ID: editData.ID,
      };
      // Make a PUT request to update the item in the database
      console.log(updatedEditData)
      response = await api.post(`http://182.18.144.204:50019/problemtype/update`, updatedEditData);
      toast.success("Item updated successfully");

      const updatedShownData = shownData.map(item =>
        item.ID === editData.ID ? updatedEditData : item
      );
      setShownData(updatedShownData);
    } else {
        const response = await api.post('http://182.18.144.204:50019/problemtype/add', formData);
        toast.success("Item added successfully")
        console.log('User added successfully:', response.data);
        const newItem = { ...formData, ID: response.data.result.Table[response.data.result.Table.length - 1].ID};
        setShownData(prevData => [...prevData, newItem]);
    }

      // const existingItemIndex = shownData.findIndex(item => item.ProductId === formData.ProductId);

      // if(existingItemIndex !== -1){
      //   const updatedShownData = [...shownData];
      //   updatedShownData[existingItemIndex] = formData;
      //   setShownData(updatedShownData);
      // }
      // else{
      //   const updatedShownData = [...shownData, formData];
      //   setShownData(updatedShownData);
      // }

      // Reset form fields after successful submission
      setFormData({
        ProductId: '',
        ProblemType: '',
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

  const colourOptions = Products.map((Product) => ({
    value: Product.ItemCode,
    label: Product.Name
  }));

  return (
    <div className="container mx-auto pt-10 mt-20 h-screen">
      <h2 className="text-3xl font-semibold mb-4">Add Item</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ProductID">
            Product
        </label>
        <Select
            className="basic-single "
            classNamePrefix="select"
            name="ProductId"
            options={colourOptions}
            value={colourOptions.find(option => option.value === formData.ProductId) || ''}
            onChange={(selectedOption) => setFormData({ ...formData, ProductId: selectedOption.value })}
        />
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ProblemType">
            Problem Type
          </label>
          <input
            type="text"
            id="ProblemType"
            name="ProblemType"
            value={formData.ProblemType}
            onChange={handleChange}
            placeholder="Enter Item Name"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-6 w-full flex justify-start items-center gap-x-4  col-span-2">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {/* {isSubmitting ? 'Adding User...' : 'Add'} */}
            {editData ? 'Edit' : 'Add'}
          </button>
          <button onClick={handleBack} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
            Go Back
          </button>
        </div>
      </form>




      <hr class=" mx-auto h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

      <div className="container mx-auto pb-10">
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="mr-2">Show entries:</label>
                <select
                  value={usersPerPage}
                  onChange={(e) => handleEntriesChange(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  {[5, 10, 20].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mt-2'>
                <span className="mr-2">Page:</span>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="border px-2 py-1 rounded"
                >
                  {pageNumbers.map((pageNumber) => (
                    <option key={pageNumber} value={pageNumber}>
                      {pageNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <table className="container mx-auto mb-5  bg-white border border-gray-300">
              <thead className="border-b-2 border- border-t-2 border-t-gray-400 border-black">
              <tr className="text-black">
                  <th className="py-2 border-b w-1/3">Product Name</th>
                  <th className="py-2 border-b w-1/3">Problem Type</th>
                  <th className="py-2 border-b w-24">Action</th>
              </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => {
                  return ( 
                  <tr key={user.ID}>
                    <td className="text-center py-2 px-4 border-b">{user.ProductId || "Not available"}</td>
                    <td className="text-center py-2 px-4 border-b">{user.ProblemType || 'Not Available'}</td>
                    <td className=" flex justify-center items-center gap-x-2 py-3">
                      {/* <Link to={`/edit-trans-state/${user.ProductID}`}> */}
                        <button onClick={() => handleEdit(user)}>
                          <FaEdit size={20} />
                        </button>
                    </td>
                  </tr>
                  )
    })}
              </tbody>
            </table>
      </div>
    </div>
  );
};

export default AddUserForm;
