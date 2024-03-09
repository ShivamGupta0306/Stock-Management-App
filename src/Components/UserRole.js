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
import Select from 'react-select';
import api from './Api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [Toggle, setToggle] = useState(false);
  const [right, setRights] = useState([]);
  const [rightData, setRightData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.post('http://182.18.144.204:50019/Role/get', {});
        setLoading(false);
        setUsers(response?.data?.result?.Table1);
        setRights(response?.data?.result?.Table);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, [Toggle, searchTerm]);

  const handleToggleChange = () => { 
    setToggle(!Toggle);
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
      const userWithID = {
        Role_Status: Toggle ? 1 : 0,
        Role_Name: searchTerm,
        userRights: rightData,
      };
      console.log(userWithID);
      await api.post(`http://182.18.144.204:50019/Role/add`, userWithID);
      setSearchTerm('');
      setRightData([]);
      toast.success("Item details updated successfully");
      setToggle(!Toggle); 
    } catch (error) {
      console.error('Error updating user details', error);
    }
  };

  const transactionOptions = right.map((right) =>({
    value: right.ID,
    label: right.Right_Name,
  }));

  const handleEntriesChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <div className="py-8 mt-20 mx-auto max-w-7xl">
        <div className="bg-white shadow-md rounded-lg px-6 py-4 mb-8">
          <h1 className="text-3xl mb-4 font-semibold tracking-wide">Create Role</h1>
          <div className="flex flex-col md:flex-row items-center gap-10 mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <label htmlFor="search" className="mr-2 font-semibold">Role Name:</label>
              <input
                type="text"
                placeholder="User Role"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex items-center mb-4 md:mb-0">
              <label className="font-semibold mr-2">Rights:</label>
              <Select
                className="w-full max-w-md"
                required="true"
                classNamePrefix="select"
                name="ProductID"
                isMulti
                value={transactionOptions.filter(option => rightData.includes(option.value))}
                options={transactionOptions}
                menuPlacement="auto"
                menuPosition="fixed"
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                  const selectedValuesString = selectedValues.join(',');
                  setRightData(selectedValuesString);
                }}
              />
            </div>
            <div className="ml-4 flex text-center">
                <label className="font-semibold">Status:</label>
                <label className="inline-flex items-center cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    value={Toggle}
                    checked={Toggle}
                    onChange={handleToggleChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer relative peer-focus:ring-4 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-black">
                    {Toggle ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
              <div className='flex flex-row gap-3'>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white font-semibold px-4 py-2 ml-5 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <IoMdAdd size={25} className="text-white" />
            </button>
            <button
              onClick={exportToExcel}
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <CiExport size={25} />
            </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 mb-4">
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
          <div>
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
        {loading ? (
          <Loading />
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className='text-4xl text-left font-semibold tracking-wide pt-2 pl-5 mb-3'>User Role List</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SNo</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role_Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Right_Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role_Status</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.Role_Id} className={(user.Role_Id) % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                    <td className="py-4 px-6 whitespace-nowrap">{user.Role_Id}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{user.Role_Name || 'Not Available'}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{user.Rights_Names || 'Not Available'}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{user.Role_Status === 1 ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>}</td>
                    <td className="py-4 px-6 whitespace-nowrap flex justify-center items-center gap-x-2">
                      <Link to={`/edit-user/${user.UserID}`}>
                        <button>
                          <FaEdit size={20} />
                        </button>
                      </Link>
                      <button>
                        <MdDelete size={21} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default UserList;
