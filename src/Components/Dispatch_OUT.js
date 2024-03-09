import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import api from './Api';


const EditUserForm = () => {
  const { docketno } = useParams();
  console.log(docketno)
  const [users, setUser] = useState([]);
  const [outQty, setOutQty] = useState({});
  const [outRemark, setoutRemark] = useState({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const[current, setCurrent] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.post(`http://182.18.144.204:50019/inventory/get`, {});
        // console.log(response);
        const fetchedUser = response.data.result.Table3; // Assuming it's an array and we take the first item
        const filteredUser = fetchedUser.filter(item => item.docketno === docketno);
        console.log(filteredUser);
        if (filteredUser) {
            setUser(filteredUser);
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
  }, [docketno]);

  const handleInputChange = (e) => {
        setCurrent((prevUser) => ({
          ...prevUser,
          [e.target.name]: e.target.value,
        }));
  };

  const handleRemarkChange = (transactionID, value) => {
    setoutRemark(prevState => ({
      ...prevState,
      [transactionID]: value
    }));
  };

  const handleReceivedQtyChange = (transactionID, value) => {
    value === null ? (
    setOutQty(prevState => ({
      ...prevState,
      [transactionID]: null
    }))): (
      setOutQty(prevState => ({
        ...prevState,
        [transactionID]: value
      }))
    );
  };


  // const hasReceivedDate = users.some(user => user.ReceivedDate !== null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (hasReceivedDate) {
    //     return;
    //   }

    setIsSubmitting(true);

    try {
      const updatedUsers = users.map(user => ({
        ...user,
        OutDate: current.OutDate || user.OutDate, // Update ReceivedDate if changed
        OutQty: outQty[user.TransactionID] ? outQty[user.TransactionID] : user.ReceivedQty,// Update ReceivedBy if changed
        OutRemark: outRemark[user.TransactionID] || user.OutRemark, // Update outRemark if changed
        OutBy : current.OutBy || user.OutBy,
        // Add more fields as needed
      }));
      console.log("Updated user", updatedUsers);
      const response = await axios.post(`http://182.18.144.204:50019/inventory/update`, updatedUsers);
      console.log(updatedUsers);
      toast.success("Item details updated successfully");
      setUser(updatedUsers);
      // const response = await axios.post(`http://182.18.144.204:50019/inventory/bycode`, {  });
      // const updatedUser = response.data.result.Table[0];
      // setUser(updatedUsers);
      setIsFormSubmitted(true); 
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
    <div className='h-screen mb-10'>
    <div className="container mx-auto pt-10 mt-20">
      <h2 className="text-3xl font-semibold mb-4">Dispatch In</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ReceivedQty">
                Received Quantity
            </label>
            <input
                type="text"
                id="ReceivedQty"
                name="ReceivedQty"
                onChange={handleInputChange}
                placeholder="Enter Received Qty"
                readOnly={hasReceivedDate}
                className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                required
            />
        </div> */}

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="OutDate">
            Out Date
        </label>
        <input
            type="date"
            id="OutDate"
            name="OutDate"
            // readOnly={hasReceivedDate}
            onChange={handleInputChange}
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
        />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="docketno">
            Docket no.
          </label>
          <input
            type="text"
            id="docketno"
            name="docketno"
            // value={formData.docketno}
            onChange={handleInputChange}
            placeholder="Enter Docket no"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="outRemark">
            Received Remark
          </label>
          <input
            type="text"
            id="outRemark"
            readOnly={hasReceivedDate}
            name="outRemark"
            onChange={handleInputChange}
            placeholder="Enter Remark"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div> */}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="OutBy">
            Out By
          </label>
          <input
            type="text"
            id="OutBy"
            name="OutBy"
            // readOnly={hasReceivedDate}
            onChange={handleInputChange}
            placeholder="Enter Name"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </form>
    </div>
    <div className="mt-6 container col-span-2 flex justify-end gap-x-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating User...' : 'Save Changes'}
          </button>
          <Link to='/transaction-list'>
          <button className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Cancel</button>
          </Link>
        </div>
    <table className="container mx-auto mt-5 bg-white border border-gray-300 ">
              <thead className="bg-blue-900">
                <tr className="text-white">
                <th className="py-2 px-4 border-b">Item Name</th>
                <th className="py-2 px-4 border-b">Transaction Type</th>
                  <th className="py-2 px-4 border-b">Transaction Date</th>
                  <th className="py-2 px-4 border-b">Received Quantity</th>
                  <th className="py-2 px-4 border-b">Out Quantity</th>
                  <th className="py-2 px-4 border-b">Received Remark</th>
                  {/* <th className="py-2 px-4 border-b">Received By</th> */}
                </tr>
              </thead>
              <tbody> 
                  {users.map((user) => {
                    const isOut = user.OutQty !== null && user.OutQty !== 0;
                    // const ReceivedQty = user.OutQty;
                    return (
                      <tr key={user.TransactionID}>
                        <td className="text-center py-2 px-4 border-b">{user.ItemName||""}</td>
                        <td className="text-center py-2 px-4 border-b">{user.TransactionType||""}</td>
                        <td className="text-center py-2 px-4 border-b">{user.TransactionDate||""}</td>
                        <td className="text-center py-2 px-4 border-b">{user.ReceivedQty || 'Not Available'}</td>
                        <td className="text-center py-2 px-4 border-b">
                        <input
                          type="number"
                          readOnly={isOut}
                          defaultValue={user.ReceivedQty ? user.ReceivedQty : user.Quantity || ''}
                          Value ={user.OutQty}
                          onChange={(e) => {
                            const inputValue = e.target.value.trim();
                            handleReceivedQtyChange(user.TransactionID, inputValue === '' ? null : parseInt(inputValue))
                          }}
                          className="appearance-none shadow-lg text-center border-b-2 border-gray-300 py-1 leading-tight focus:outline-none focus:border-blue-500"
                        />
                        </td>
                        {/* <td className="text-center py-2 px-4 border-b">{user.ReceivedBy || ''}</td> */}
                        <td className="text-center py-2 px-4 border-b">
                        <input
                          type="text"
                          defaultValue ={''}
                          // readOnly={hasReceivedDate}
                          placeholder='Enter remark'
                          onChange={(e) => handleRemarkChange(user.TransactionID, e.target.value)}
                          className="appearance-none shadow-lg text-center border-b-2 border-gray-300 py-1 leading-tight focus:outline-none focus:border-blue-500"
                        />
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
    </div>
  );
};

export default EditUserForm;
