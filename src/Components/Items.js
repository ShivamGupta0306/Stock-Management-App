import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { IoMdAdd } from 'react-icons/io';
import { CiExport } from 'react-icons/ci';
import { MdEdit } from "react-icons/md";
import { CiImport } from 'react-icons/ci';
import Loading from './Loading';
import '../App.css';
import toast from 'react-hot-toast';
import api from './Api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.post('http://182.18.144.204:50019/Product/product', {});
        setTimeout(() => {
          setLoading(false);
          setUsers(response?.data?.result?.Table);
        }, 500);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setFileData(excelData);

        // Submit the form
        try {
          const jsonData = excelData.map(row => {
            return {
              ItemName: row[1], // Assuming the first column is ItemName
              ItemGroupCode: row[2],
              IsActive: row[4],
              include_serial_no: row[3]
              // ItemGroupCode: row[1], // Assuming the second column is ItemGroupCode
              // Add more fields as needed
            };
          });
          const response = await api.post('http://182.18.144.204:50019/product/add', jsonData);
          toast.success("Item added successfully")
          console.log('User added successfully:', response.data);
        } catch (error) {
          console.error('Error adding user:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
};

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users?.filter((user) => {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const ItemCodeString = user.ItemCode.toString();
    const UnitString = user.Unit ? user.Unit.toString() : '';
    const getSafeValue = (value) => (value ? value.toLowerCase() : 'Not Available');

    return (
      getSafeValue(user.ItemName).includes(lowercaseSearchTerm) ||
      ItemCodeString.includes(lowercaseSearchTerm) ||
      UnitString.includes(lowercaseSearchTerm) ||
      (searchTerm.toLowerCase() === 'active' && user.IsActive === "Yes") ||
      (searchTerm.toLowerCase() === 'inactive' && user.IsActive === "No")
    );
  });

  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  const totalPageCount = Math.ceil(filteredUsers?.length / usersPerPage);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, index) => index + 1);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ItemsList');
    XLSX.writeFile(wb, 'ItemsList.xlsx');
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
        <form ref={formRef} className="hidden">
            <input
              ref={fileInputRef}
              type="file"
              id="fileInput"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="transition-all hidden duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
              required
            />
            <button type='submit' className='hidden'>submit</button>
        </form>
        <div className="flex justify-end items-center gap-x-3 mb-2">
              <Link to="/createitem" className="bg-blue-500 rounded-md px-2 py-1 hover:bg-blue-700 text-lg font-semibold">
                <IoMdAdd size={25} className="text-white rounded-md" />
              </Link>
              <button
                onClick={exportToExcel}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded"
              >
                <CiExport size={25} />
              </button>
              <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded"
                  onClick={() => fileInputRef.current.click()}
              >
                  <CiImport rotate={90} size={25}/>
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
            <table className="min-w-full min-h-full bg-white border border-gray-300 mb-10">
              <thead className="bg-blue-900">
                <tr className="text-white">
                  <th className="py-2 px-4 border-b">Item Code</th>
                  <th className="py-2 px-4 border-b">Item Group Name</th>
                  <th className="py-2 px-4 border-b">Item Name</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers?.map((user) => (
                  <tr key={user.ItemCode}>
                    <td className="text-center py-2 px-4 border-b">{user.ItemCode}</td>
                    <td className="text-center py-2 px-4 border-b">{user.ItemGroupName || 'Not Available'}</td>
                    <td className="text-center py-2 px-4 border-b">{user.ItemName || 'Not Available'}</td>
                    <td className="text-center py-2 px-4 border-b">
                        {user.IsActive === "Yes" ? (
                            <span className="text-green-500">Active</span>
                        ) : (
                            <span className="text-red-500">Inactive</span>
                        )}
                    </td>

                    <td className="text-center py-2 px-4 border-b">
                      <Link to={`/edit-item/${user.ItemCode}`}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded">
                          <MdEdit size={24} />
                        </button>
                      </Link>
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
