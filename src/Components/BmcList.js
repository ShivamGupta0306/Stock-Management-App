import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { IoMdAdd } from 'react-icons/io';
import { CiExport } from 'react-icons/ci';
import { MdEdit } from "react-icons/md";
import Loading from './Loading';
import '../App.css';
import api from './Api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.post('http://182.18.144.204:50019/bmc/get', {});
        setTimeout(() => {
          setLoading(false);
          setUsers(response.data.result.Table);
        }, 500);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter((user) => {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const userIdString = user.Center_Code.toString();
    const phonenoString = user.Phone_No ? user.Phone_No.toString() : '3245245';
    const getSafeValue = (value) => (value ? value.toLowerCase() : 'Not Available');

    return (
      getSafeValue(user.Center_Name).includes(lowercaseSearchTerm) ||
      // getSafeValue(user.Firstname).includes(lowercaseSearchTerm) ||
      userIdString.includes(lowercaseSearchTerm) ||
      phonenoString.includes(lowercaseSearchTerm)
    );
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, index) => index + 1);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PlantList');
    XLSX.writeFile(wb, 'PlantList.xlsx');
  };

  const handleEntriesChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className='min-h-screen h-full'>
      <div className='pt-10 mt-20'>
        <div className="container mx-auto pb-10">
          <div className='flex justify-between items-center mb-4'>
            <div>
              <label htmlFor="search" className='mr-2 font-semibold'>Search: </label>
              <input
                type="text"
                placeholder="Search by name, username, or firstname"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="mb-4 px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end items-center gap-x-3 mb-2">
              <Link to="/create-bmc" className="bg-blue-500 rounded-md px-2 py-1 hover:bg-blue-700 text-lg font-semibold">
                <IoMdAdd size={25} className="text-white rounded-md" />
              </Link>
              <button
                onClick={exportToExcel}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded"
              >
                <CiExport size={25} />
              </button>
            </div>
          </div>

          {loading ? (
            <Loading/>
          ) : (
            <>
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
              <div className="table-container overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-blue-900">
                    <tr className="text-white">
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Code</th>
                      <th className="py-2 px-4 border-b">City</th>
                      <th className="py-2 px-4 border-b">Phone Number</th>
                      <th className="py-2 px-4 border-b">Address</th>
                      <th className="py-2 px-4 border-b">Other Code</th>
                      <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.Center_Code}>
                        <td className="text-center py-2 px-4 border-b">{user.Center_Name || 'Not Available'}</td>
                        <td className="text-center py-2 px-4 border-b">{user.Center_Code || 'Not Available'}</td>
                        <td className="text-center py-2 px-4 border-b">{user.City || 'Not Available'}</td>
                        <td className="text-center py-2 px-4 border-b">{user.Phone_No || 'Not Available'}</td>
                        <td className="text-center py-2 px-4 border-b">{user.Address || 'Not Available'}</td>
                        <td className="text-center py-2 px-4 border-b">{user.Other_Code || 'Not Available'}</td>
                        <td className="text-center py-2 px-4 border-b">
                          <Link to={`/edit-bmc/${user.Center_Code}`}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded">
                              <MdEdit size={24} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
