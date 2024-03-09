import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { IoMdAdd } from 'react-icons/io';
import { CiExport } from 'react-icons/ci';
import { FaEdit } from "react-icons/fa";
import Loading from './Loading';
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import api from './Api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [Toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.post('http://182.18.144.204:50019/userrightmaster/get', {});
        setLoading(false);
        setUsers(response.data.result.Table);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, [Toggle, searchTerm]);

  const handleToggleChange = () => { 
    setToggle(!Toggle);
  };

  const handleDelete = async (userId) => {
    try {
      await api.post(`http://182.18.144.204:50019/userrightmaster/delete`, {"RightID" : userId});
      toast.success("Item deleted successfully");
      // Refetch users after deletion
      const response = await api.post('http://182.18.144.204:50019/userrightmaster/get', {});
      setUsers(response?.data?.result?.Table);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPageCount = Math.ceil(users.length / usersPerPage);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, index) => index + 1);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UserList');
    XLSX.writeFile(wb, 'UserList.xlsx');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        RightName: searchTerm,
        status: Toggle,
      }
      await api.post(`http://182.18.144.204:50019/userrightmaster/add`, updatedUser);
      toast.success("Item details updated successfully");
      setToggle(false); 
      setSearchTerm('');
    } catch (error) {
      console.error('Error updating user details', error);
    }
  };

  const handleEntriesChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className='min-h-screen'>
      <div className='py-8 mt-20 mx-auto max-w-7xl'>
        <div className="bg-white shadow-md rounded-lg px-6 py-4 mb-8">
          <h1 className='text-3xl mb-4 font-semibold text-left tracking-wide'>Create Right</h1>
          <div className='flex md:flex-row flex-col items-center mb-4 sm:flex-wrap mt-5'>
            <div className='flex md:flex-row flex-col justify-center items-center gap-3'>
              <div className='flex flex-row items-center'>
              <label htmlFor="search" className='mr-2 font-semibold'>Right Name: </label>
              <input
                type="text"
                placeholder="User Right"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border rounded-md"
              />
              </div>

              <div className="flex justify-start items-center gap-x-3">
                <label className=" text-gray-700 font-semibold">Status:</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    value={Toggle}
                    checked={Toggle}
                    onChange={handleToggleChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer relative peer-focus:ring-4  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-black">
                    {Toggle ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
              <div className='flex flex-row items-center gap-3'>
              <div onClick={handleSubmit} className="bg-blue-500 rounded-md px-2 py-2 hover:bg-blue-700 text-lg font-semibold">
                <IoMdAdd size={25} className="text-white rounded-md" />
              </div>
              <div className="flex justify-start items-center gap-x-3 md:mb-0">
              <button
                onClick={exportToExcel}
                className="bg-blue-500 rounded-md px-2 py-2 text-white hover:bg-blue-700 text-lg font-semibold"
              >
                <CiExport size={25} />
              </button>
            </div>
            </div>
            </div>
            
          </div>

          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-wrap justify-start items-center mt-4">
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
                <div className='md:flex'>
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
              <hr class="h-px my-16 mb-0 bg-gray-200 border-0 dark:bg-gray-700"/>
              <table className="min-w-full  bg-white border border-gray-300 ">
                <caption className='text-4xl text-left font-semibold text-white tracking-wide mb-5'>User Right List</caption>
                <thead className="border-b-2 border- border-t-2 border-t-gray-400 border-black ">
                  <tr className="text-black">
                    <th className="py-2 px-4 border-b">SNo</th>
                    <th className="py-2 px-4 border-b">Right_Name</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.ID} className={(user.ID) % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                      <td className="text-center py-2 px-4 border-b font-semibold">{user.ID}</td>
                      <td className="text-center py-2 px-4 border-b">{user.Right_Name || 'Not Available'}</td>
                      <td className="text-center py-2 px-4 border-b">
                        {user.status ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>}
                      </td>
                      <td className=" flex justify-center items-center gap-x-2 py-3">
                        <Link to={`/edit-user/${user.ID}`}>
                          <button>
                            <FaEdit size={20} />
                          </button>
                        </Link>
                        <button  onClick={() => handleDelete(user.ID)}>
                          <MdDelete size={21}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
