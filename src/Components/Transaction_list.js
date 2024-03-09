import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { IoMdAdd } from 'react-icons/io';
import { CiExport } from 'react-icons/ci';
import { MdEdit } from "react-icons/md";
import Loading from './Loading';
import '../App.css';
import { useUserRights } from './UserRightsContext';
import api from './Api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const { userRights } = useUserRights();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (userRights) {
      if (userRights.includes("Add") && userRights.includes("Dispatch")) {
        setShowAdd(true);
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await api.post('http://182.18.144.204:50019/inventory/get', {});
        setTimeout(() => {
          setLoading(false);
          console.log(response)
          setUsers(response?.data?.result?.Table2 || []);
          setData(response?.data?.result?.Table2 || []);
          console.log("Data is : ", data);
        }, 500);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, [userRights]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter((user) => {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const userIdString = user.ProductID ? user.ProductID.toString() : "not available";
    const phonenoString = user.Quantity ? user.Quantity.toString() : '3245245';

    return (
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
    XLSX.utils.book_append_sheet(wb, ws, 'CompanyList');
    XLSX.writeFile(wb, 'CompanyList.xlsx');
  };

  const handleEntriesChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className='min-h-screen h-full'>
      <div className='pt-10 mt-20 mx-auto max-w-7xl'>
        <div className="container mx-auto pb-10">
          <div className='flex flex-row md:justify-between gap-5 items-center mb-4'>
            <div className="md:mb-0">
              <label htmlFor="search" className='mr-2 font-semibold'>Search: </label>
              <input
                type="text"
                placeholder="Search by name, username, or firstname"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className=" px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end items-center gap-x-3">
              {showAdd ? (
                <Link to="/create-transaction" className="bg-blue-500 rounded-md px-2 py-1 hover:bg-blue-700 text-lg font-semibold">
                  <IoMdAdd size={25} className="text-white rounded-md" />
                </Link>
              ) : null}
              <button
                onClick={exportToExcel}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded"
              >
                <CiExport size={25} />
              </button>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
              <>
                <div className="flex flex-row justify-between items-center m-10">
                  <div className=" md:mb-0">
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
                  <div className='flex items-center'>
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
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-gray-300">
                    <thead className="bg-blue-900 text-white">
                      <tr>
                        <th className="py-2 px-4 border-b">Docket No.</th>
                        <th className="py-2 px-4 border-b">UserName</th>
                        <th className="py-2 px-4 border-b">Transaction Type</th>
                        <th className="py-2 px-4 border-b">Transaction Date</th>
                        <th className="py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => {
                        const hasReceivedDate = user.ReceivedQty !== 0 && user.ReceivedQty !== null;
                        const date = user.TransactionDate.split('T')[0];

                        return (
                          <tr key={user.TransactionID}>
                            <td className="py-2 text-center px-4 border-b">{user.docketno || 'Not Available'}</td>
                            <td className="py-2 text-center  px-4 border-b">{user.Username || 'Not Available'}</td>
                            <td className="py-2 text-center  px-4 border-b">{user.TransactionType || 'Not Available'}</td>
                            <td className="py-2 text-center  px-4 border-b">{date || 'Not Available'}</td>
                            <td className="py-2 text-center px-4 marker: border-b gap-x-4 flex items-center justify-center">
                              <Link to={`/dispatch-in/${user.docketno}`}>
                                <button className="bg-green-700 hover:bg-green-900 text-white text-center  font-bold py-1 px-2 rounded">
                                  IN
                                </button>
                              </Link>
                              <Link to={`/dispatch-out/${user.docketno}`}>
                                <button className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ${hasReceivedDate ? '' : 'hidden'}`}>
                                  OUT
                                </button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
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
