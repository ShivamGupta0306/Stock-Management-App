import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import Loading from './Loading';
import api from './Api';

const EditUserForm = () => {
  const { ItemMasterGroupCode } = useParams();
  console.log(ItemMasterGroupCode)
  const [user, setUser] = useState({
    ItemGroupName: '',
    ItemMasterGroupCode: '',
    isactive: false,
    ItemGroupCode:ItemMasterGroupCode
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        
        const response = await api.post(`http://182.18.144.204:50019/Product/editgroup`, { ItemMasterGroupCode });
        console.log(response);
        const fetchedUser = response.data.result.Table[0]; // Assuming it's an array and we take the first item
        console.log(fetchedUser);
        if (fetchedUser) {
          setUser((prevUser) => ({
            ...prevUser,
            ItemGroupName: fetchedUser?.ItemGroupName || '',
            ItemMasterGroupCode: fetchedUser?.ItemMasterGroupCode || '',
            isactive: fetchedUser?.isactive || false,
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
  }, [ItemMasterGroupCode]);
  

  const handleInputChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleToggleChange = () => { 
    setUser((prevUser) => ({
      ...prevUser,
      isactive: !prevUser.isactive,
    }));
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await axios.post(`http://182.18.144.204:50019/Product/addgroup`, user);
      console.log(user);
      toast.success("Item details updated successfully");
      navigate('/item-groups');
    } catch (error) {
      console.error('Error updating user details', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading/>; // You can replace this with a loading spinner or any other UI for loading
  }

  return (
    <div className='h-screen'>
    <div className="container mx-auto pt-10  mt-20">
      <h2 className="text-3xl font-semibold mb-4">Edit Item Group</h2>
      <form onSubmit={handleSubmit} className="my-auto  grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mt-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">Item Group Name:</label>
          <input
            type="text"
            name="ItemGroupName"
            value={user.ItemGroupName}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mt-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">Item Group Code:</label>
          <input
            type="text"
            name="ItemMasterGroupCode"
            value={user.ItemMasterGroupCode}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mt-8 flex justify-start text-white items-center gap-x-3">
          <label className=" text-gray-700 text-sm text-white font-bold">Status:</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={user.isactive}
              onChange={handleToggleChange}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer relative peer-focus:ring-4  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-white dark:text-white">
              {user.isactive ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>
        <div className="mt-10 w-full flex justify-center items-center gap-x-4  col-span-2">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating User...' : 'Save Changes'}
          </button>
          <Link to='/item-groups'>
          <button className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
    </div>
  );
};

export default EditUserForm;
