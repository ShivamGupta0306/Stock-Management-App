import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import Select from 'react-select';
import api from './Api';

const EditUserForm = () => {
  const { ID } = useParams();
  const [products, setProducts] = useState([]);
  console.log(ID)
  const [user, setUser] = useState({
    ProblemType: '',
    ProductId:'',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.post(`http://182.18.144.204:50019/problemtype/bycode`, { ID });
        console.log(response);
        const fetchedUser = response.data.result.Table1[0]; // Assuming it's an array and we take the first item
        console.log(fetchedUser);
        if (fetchedUser) {
          setUser((prevUser) => ({
            ...prevUser,
            ProblemType: fetchedUser?.Problem_type || '',
            ProductId: fetchedUser?.productId || '',
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
  }, [ID]);
  
  useEffect(() =>{
    async function fetchProducts(){
        const response = await api.post('http://182.18.144.204:50019/problemtype/get', {});
        console.log("Products are : ", response.data.result.Table)
        setProducts(response.data.result.Table);
    }
    fetchProducts();
  }, [ID]);

  const handleInputChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
        const formWithId = {
            ...user,
            ID:ID,
        }
      await api.post(`http://182.18.144.204:50019/problemtype/update`, formWithId);
      console.log(formWithId);
      toast.success("Item details updated successfully");
      navigate('/problem-type');
    } catch (error) {
      console.error('Error updating user details', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other UI for loading
  }

  const colourOptions = products.map((product) =>({
    value: product.ItemCode,
    label: product.Name,
  }))

  return (
    <div className='h-screen'>
    <div className="container h-full mx-auto pt-10 mt-20">
      <h2 className="text-3xl font-semibold mb-4">Edit Problem Type</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ProductID">
                Product
            </label>
            <Select
                className="basic-single "
                classNamePrefix="select"
                name="ProductID"
                options={colourOptions}
                value={colourOptions.find(option => option.value === user.ProductId) || ''}
                onChange={(selectedOption) => setUser({ ...user, ProductId: selectedOption.value })}
            />
            </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Problem Type</label>
          <input
            type="text"
            name="ProblemType"
            value={user.ProblemType}
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
          <Link to='/problem-type'>
          <button className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
    </div>
  );
};

export default EditUserForm;
