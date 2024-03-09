import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../App.css';
import { Link, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import { CiExport } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const AddPlant = () => {
  const [edit, setEdit] = useState(false);
    const {Id} = useParams();
    const navigate = useNavigate();
    const[company, setCompany] = useState([]);
    const[Products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState([]);
    const [mcc, setMcc] = useState([]);
    const [plant, setPlant] = useState([]);
  const [formData, setFormData] = useState({
    userId:'',
    compId:'',
    roleId:'',
    mccId:'',
    bmcId:'',
  });

  useEffect(()=>{
    async function fetchCompany(){
        try{
            const response = await api.post('http://182.18.144.204:50019/RoleManager/get', {});
            setCompany(response?.data?.result?.Table3);
            setUsers(response?.data?.result?.Table1);
            setRole(response?.data?.result?.Table2);
            setMcc(response?.data?.result?.Table4);
            setPlant(response?.data?.result?.Table5);
            setProducts(response?.data?.result?.Table);
        }
        catch(err){
            console.error(err);
        }
    }  
    
    fetchCompany();
  },[])

  const handleEdit = () => {
    setEdit(true);
  };

  useEffect(()=>{
    async function fetchCompanyByCode(){
        try{
            const response = await api.post('http://182.18.144.204:50019/RoleManager/getbycode', {Id});
            const fetchedDetails = response?.data?.result?.Table5[0];
            setFormData((prevUser) =>({
              ...prevUser, 
              userId:fetchedDetails.userId,
              compId: fetchedDetails.compId,
              roleId:fetchedDetails.roleId,
              mccId:fetchedDetails.mccId,
              bmcId:fetchedDetails.bmcId,
            }));
            console.log(fetchedDetails)
        }
        catch(err){
            console.error(err);
        }
    }  
    
    fetchCompanyByCode();
  },[Id])

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    // setEdit(false);
    try {
      if(Id){
        const formDatawithId = {
          ...formData,
          Id:Id,
        }
        const response = await api.post('http://182.18.144.204:50019/RoleManager/update', formDatawithId);

      toast.success("Item updated successfully")
      setEdit(false);
      navigate('/user-map')
      console.log('User added successfully:', response?.data);

      const updatedProduct = await api.post('http://182.18.144.204:50019/RoleManager/get', {});
      setProducts(updatedProduct?.data?.result?.Table);
      }
      else{
        const response = await api.post('http://182.18.144.204:50019/RoleManager/add', formData);

        toast.success("Item added successfully")
        console.log('User added successfully:', response?.data);

        const updatedProduct = await api.post('http://182.18.144.204:50019/RoleManager/get', {});
        setProducts(updatedProduct?.data?.result?.Table);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colourOptions = role.map((r) => ({
    value: r.role_id,
    label: r.Role_Name
  }));

  const transactionOptions = users.map((user) =>({
    value: user.userid,
    label: user.username,
  }))

  const companyOptions = company.map((c) =>({
    value:c.CompanyCode,
    label:c.CompanyName,
  }))

  const mccOptions = mcc.map((m) =>({
    value:m.mccId,
    label:m.mccName,
  }))

  const bmcOptions = plant.map((bmc) =>({
    value:bmc.cntCode,
    label:bmc.cntName,
  }))

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = Products.slice(indexOfFirstUser, indexOfLastUser);

  const totalPageCount = Math.ceil(Products.length / usersPerPage);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, index) => index + 1);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UserList');
    XLSX.writeFile(wb, 'UserList.xlsx');
  };

  const handleEntriesChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };
  

  return (
    <div className='min-h-screen h-full mb-10'>
    <div className="container mx-auto pt-10 mt-20">
      <h2 className="text-3xl font-semibold mb-4 tracking-wide">Map User</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-4 max-w-2xl mx-auto">
        <div className="mb-4">
        <label className="block text-gray-700 text-md font-bold mb-2" htmlFor="ProductID">
            User
        </label>
        <Select
            className="basic-single "
            required="true"
            classNamePrefix="select"
            name="ProductID"
            value = {transactionOptions.find(option=>option.value === formData.userId)}
            options={transactionOptions}
            onChange={(selectedOption) => setFormData({ ...formData, userId: selectedOption.value })}
        />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-md font-bold mb-2" htmlFor="RoleId">
            Role
        </label>
        <Select
            className="basic-single "
            required="true"
            classNamePrefix="select"
            name="RoleId"
            value = {colourOptions.find(option=>option.value === formData.roleId)}
            options={colourOptions}
            onChange={(selectedOption) => setFormData({ ...formData, roleId: selectedOption.value })}
        />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="CompId">
            Company
        </label>
        <Select
            className="basic-single "
            required="true"
            classNamePrefix="select"
            name="CompId"
            value = {companyOptions.find(option=>option.value === formData.compId)}
            options={companyOptions}
            onChange={(selectedOption) => setFormData({ ...formData, compId: selectedOption.value })}
        />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mccId">
            MCC
        </label>
        <Select
            className="basic-single "
            classNamePrefix="select"
            required="true"
            name="mccId"
            value = {mccOptions.find(option=>option.value === formData.mccId)}
            options={mccOptions}
            onChange={(selectedOption) => setFormData({ ...formData, mccId: selectedOption.value })}
        />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bmcId">
            BMC
        </label>
        <Select
            className="basic-single "
            classNamePrefix="select"
            name="bmcId"
            required="true"
            value = {bmcOptions.find(option=>option.value === formData.bmcId)}
            options={bmcOptions}
            onChange={(selectedOption) => setFormData({ ...formData, bmcId: selectedOption.value })}
        />
        </div>
        
        <div className="mt-2 w-full flex justify-start items-center gap-x-4  col-span-2">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          {Id && (
              <button
                type="button"
                onClick={() => {setEdit(false)
                navigate('/user-map')}}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
            )}
        </div>
      </form>
    </div>
    
    <div className='container mx-auto'>
    <div className="flex justify-end items-center gap-x-3 mb-2">
              
              <button
                onClick={exportToExcel}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded"
              >
                <CiExport size={25} />
              </button>
    </div>
            
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
            </div>
              
    <hr class="container mx-auto h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <table className="container mx-auto mb-5  bg-white border border-gray-300 ">
    <caption className='text-4xl text-left font-semibold text-white tracking-wide mb-5'>User Map List</caption>
      <thead className="border-b-2 border- border-t-2 border-t-gray-400 border-black ">
        <tr className="text-black">
          <th className="py-2 px-4 border-b">SNo</th>
          <th className="py-2 px-4 border-b">UserName</th>
          <th className="py-2 px-4 border-b">RoleName</th>
          <th className="py-2 px-4 border-b">CompanyName</th>
          <th className="py-2 px-4 border-b">MccName</th>
          <th className="py-2 px-4 border-b">BmcName</th>
          <th className="py-2 px-4 border-b">Action</th>

        </tr>
      </thead>
      <tbody>
        {currentUsers.map((product) => (
          <tr key={product.Id} className={(product.Id)%2 === 0 ? "bg-white" : "bg-gray-200"}>
            <td className="text-center py-2 px-4 border-b font-semibold">{product.Id}</td>
            <td className="text-center py-2 px-4 border-b">{product.UserName || 'Not Available'}</td>
            <td className="text-center py-2 px-4 border-b">{product.RoleName || 'Not Available'}</td>
            <td className="text-center py-2 px-4 border-b">{product.CompanyName || 'Not Available'}</td>
            <td className="text-center py-2 px-4 border-b">{product.mccName || 'Not Available'}</td>
            <td className="text-center py-2 px-4 border-b">{product.bmcName || 'Not Available'}</td>

            <td className=" flex justify-center items-center gap-x-2 py-3">
              <Link to={`/edit-map/${product.Id}`}>
                <button  onClick={handleEdit}>
                  <FaEdit size={20} />
                </button>
              </Link>
              <button>
                <MdDelete size={21}/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>

    
  );
};

export default AddPlant;
