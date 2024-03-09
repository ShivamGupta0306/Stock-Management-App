import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useUserRights } from './UserRightsContext';
import api from './Api';


const AddPlant = () => {
    const {userId} = useUserRights(); 
    const navigate = useNavigate();
    const [status, setStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);
    const[company, setCompany] = useState([]);
    const[Products, setProducts] = useState([]);
    const [shownData, setShownData] = useState([]);
    const [problemTypes, setProblemtype] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedProblem, setSelectedProblem] = useState([]);

  const [formData, setFormData] = useState({
    ProductID: '',
    ProblemType: '',
    serialNo : '',
    Quantity: '',
    TransactionType:'',
    TransactionDate:'',
    remark:'',
    docketno:'',
    warranty:'',
  });

  useEffect(()=>{
    async function fetchCompany(){
        try{
            const response = await api.post('http://182.18.144.204:50019/inventory/get', {});
            setCompany(response.data.result.Table);
            setProducts(response.data.result.Table);
            setProblemtype(response.data.result.Table1);
            console.log(company);
            console.log(problemTypes)
        }
        catch(err){
            console.error(err);
        }
    }  
    
    fetchCompany();
  },[])

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (userId) => {
    try {
      // await axios.post(`http://182.18.144.204:50019/userrightmaster/delete`, {"RightID" : userId});
      const updatedShownData = shownData.filter(item => item.ProductID !== userId);
        setShownData(updatedShownData);
    
        // Adjust pagination if the current page becomes empty
        if (updatedShownData.length % 5 === 0 && currentPage > 1) {
          // Decrement the current page by 1 if it's greater than 1
          setCurrentPage(currentPage - 1);
        }
      // setCurrentPage(currentPage-1);
      // toast.success("Item deleted successfully");
      // Refetch users after deletion
      // const response = await axios.post('http://182.18.144.204:50019/userrightmaster/get', {});
      // setUsers(response.data.result.Table);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  useEffect(() => {
    const fetchProblemTypes = async () => {
        try {
            // Assuming problemTypes is an array containing all problem types
            // Filter the problemTypes array based on the selected product
            const filteredProblems = problemTypes.filter(problem => problem.ProductId === selectedProduct.value);

            // Update the state with the filtered problem types
            setSelectedProblem(filteredProblems);

            // Logging for debugging
            console.log("Selected problem:", filteredProblems);
        } catch (error) {
            console.error("Error fetching problem types:", error);
        }
    };

    // Check if a product is selected
    if (selectedProduct) {
      console.log("Selected product", selectedProduct);
      if (selectedProduct.include_serial_no) {
        setFormData({
          ...formData,
          Quantity: 1,
        });
      }
        fetchProblemTypes();
    } else {
        // Reset the selected problem types if no product is selected
        setSelectedProblem([]);
    }
}, [selectedProduct, problemTypes]);

  const handleProductchange = (selectedoption) =>{
    setSelectedProduct(selectedoption);
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // const selectedProduct = Products.find(product => product.ItemCode === value);
    // if (selectedProduct) {
    //   // Assuming problem types are stored in the selected product object
    //   setProblemtype(selectedProduct.problemTypes);
    // } else {
    //   // If no product is selected or problem types are not available, clear the problem types
    //   setProblemtype([]);
    // }
  };

  const handleSave = async() =>{
    try{
        shownData.forEach(item => {
          item.userid = userId;
        })
        console.log(shownData)
        const response = await api.post('http://182.18.144.204:50019/inventory/add', shownData);
        toast.success("Item added successfully");
        console.log(shownData)
        // console.log('User added successfully:', response.data);
    } catch(err){
      console.error(err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      
        // const formDataWithCompany = {
        //     ...formData,
        //     ProductID: company.ProductID,
        //   };
      // Replace 'API_ENDPOINT' with your actual API endpoint
      // const response = await axios.post('http://182.18.144.204:50019/inventory/add', formData);
      const existingItemIndex = shownData.findIndex(item => item.ProductID === formData.ProductID);

      if(existingItemIndex !== -1){
        const updatedShownData = [...shownData];
        updatedShownData[existingItemIndex] = formData;
        setShownData(updatedShownData);
      }
      else{
        const updatedShownData = [...shownData, formData];
        setShownData(updatedShownData);
      }
      // console.log(updatedShownData);
      

      // Reset form fields after successful submission
      setFormData({
        ProductID: '',
        ProblemType: '',
        serialNo : '',
        Quantity: '',
        TransactionType:'',
        TransactionDate:'',
        remark:'',
        docketno:'',
        warranty:'',
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
  const [editData, setEditData] = useState(null);

  // Function to handle edit
  const handleEdit = (transaction) => {
    setEditData(transaction);
    setFormData({
      ProductID: transaction.ProductID,
      ProblemType: transaction.problemTypeId,
      serialNo: transaction.serialNo,
      Quantity: transaction.Quantity,
      TransactionType: transaction.TransactionType,
      TransactionDate: transaction.TransactionDate,
      remark: transaction.remark,
      docketno: transaction.docketno,
      warranty: transaction.warranty,
    });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = shownData.slice(indexOfFirstUser, indexOfLastUser);

  const totalPageCount = Math.ceil(shownData.length / usersPerPage);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, index) => index + 1);

  const handleEntriesChange = (value) => {
    setUsersPerPage(value);
    setCurrentPage(1);
  };


  const colourOptions = Products.map((Product) => ({
    value: Product.ItemCode,
    label: Product.Name,
    include_serial_no: Product.include_serial_no,
  }));

  const transactionOptions = [
    {value: "IN", label: "IN"},
    {value: "OUT", label: "OUT"},
    {value: "DISPATCH", label: "DISPATCH"},
    {value: "SPARE", label: "SPARE"},
  ]

  const problemOptions = selectedProblem.map((problem) => ({
    value: problem.Id,
    label: problem.Name
  }));

  var date = new Date(Date.now()).toISOString().slice(0, 10);
  console.log(date);

  return (
    <>
    <div className="container mx-auto pt-10 mt-20">
      <h2 className="text-3xl font-semibold mb-4">Add Transaction</h2>
      
      <form onSubmit={handleSubmit} className='container'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-9">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TransactionType">
            Transaction Type
        </label>
        <Select
            className="basic-single"
            classNamePrefix="select"
            name="TransactionType"
            options={transactionOptions}
            value={transactionOptions.find(option => option.value === formData.TransactionType)}
            onChange={(selectedOption) => setFormData({ ...formData, TransactionType: selectedOption.value })}
        />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TransactionDate">
            Transaction Date
        </label>
        <input
            type="date"
            id="TransactionDate"
            name="TransactionDate"
            value={formData.TransactionDate}
            onChange={handleChange}
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
            value={formData.docketno}
            onChange={handleChange}
            placeholder="Enter Docket no"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        </div>

        <br />
        <hr class="container mx-auto h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>

        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mt-8 mx-auto">
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ProductID">
            Product
        </label>
        <Select
            className="basic-single "
            classNamePrefix="select"
            name="ProductID"
            options={colourOptions}
            value={colourOptions.find(option => option.value === formData.ProductID) || ''}
            onChange={(selectedOption) => {setFormData({ ...formData, ProductID: selectedOption.value }); handleProductchange(selectedOption)}}
        />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ProblemType">
            Problem Type
        </label>
        <Select
            className="basic-single "
            classNamePrefix="select"
            name="ProblemType"
            options={problemOptions}
            value={problemOptions.find(option => option.value === formData.ProblemType) || ''}
            onChange={(selectedOption) => setFormData({ ...formData, ProblemType: selectedOption.value })}
            isDisabled={selectedProblem.length === 0}
        />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serialNo">
            Serial no.
          </label>
          <input
            type="text"
            id="serialNo"
            name="serialNo"
            value={formData.serialNo}
            onChange={handleChange}
            placeholder="Enter Quantity"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
                e.preventDefault();
              }
            }} 
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {selectedProduct && selectedProduct.include_serial_no ? (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Quantity">
              Quantity
            </label>
            <input
              type="number"
              id="Quantity"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              placeholder="Enter Quantity"
              pattern="[0-9]*"
              onKeyDown={(e) => {
                if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
                  e.preventDefault();
                }
              }} 
              disabled // Disable modification
              className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Quantity">
              Quantity
            </label>
            <input
              type="number"
              id="Quantity"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              placeholder="Enter Quantity"
              className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remark">
                Remark
          </label>
          <input
            type="text"
            id="remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            placeholder="Enter Remark"
            className="transition-all duration-300 ease-in-out appearance-none border-b-2 border-gray-300 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="warranty">
            Warranty Date
        </label>
        <input
            type="date"
            id="warranty"
            name="warranty"
            defaultValue={date}
            value={formData.warranty ? formData.warranty : date}
            onChange={handleChange}
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
            {isSubmitting ? 'Adding User...' : 'Add Item'}
          </button>
          <button onClick={handleBack} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
            Go Back
          </button>
        </div>
        </div>

      </form>
    </div>

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
            <div className="container mx-auto mb-5 max-w-4xl overflow-x-auto">
  <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
    <table className="w-full">
      <thead className="border-b-2 border-t-2 border-t-gray-400 border-black">
        <tr className="text-black">
          <th className="py-2 px-4 border-b">Transaction Type</th>
          <th className="py-2 px-4 border-b">Transaction Date</th>
          <th className="py-2 px-4 border-b">Docket No.</th>
          <th className="py-2 px-4 border-b">Product</th>
          <th className="py-2 px-4 border-b">Quantity</th>
          <th className="py-2 px-4 border-b">Remark</th>
          <th className="py-2 px-4 border-b">Action</th>
        </tr>
      </thead>
      <tbody>
        {currentUsers.map((user) => {
          return (
            <tr key={user.ID}>
              <td className="py-2 px-4 border-b">{user.TransactionType || 'Not Available'}</td>
              <td className="py-2 px-4 border-b">{user.TransactionDate || 'Not Available'}</td>
              <td className="py-2 px-4 border-b">{user.docketno || 'Not Available'}</td>
              <td className="py-2 px-4 border-b">{user.ProductID || 'Not Available'}</td>
              <td className="py-2 px-4 border-b">{user.Quantity || 'Not Available'}</td>
              <td className="py-2 px-4 border-b">{user.remark || 'Not Available'}</td>
              <td className="flex justify-center items-center gap-x-2 py-3">
                <button onClick={() => handleEdit(user)}>
                  <FaEdit size={20} />
                </button>
                <button onClick={() => handleDelete(user.ProductID)}>
                  <MdDelete size={21}/>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

            {shownData.length > 0 ? <div className="mt-6 w-full flex justify-start items-center gap-x-4  col-span-2">
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
            onClick={handleSave}
          >
            {isSubmitting ? 'Adding User...' : 'Save'}
          </button>
        </div> : null}
      </div>
      </>
      
  );
};

export default AddPlant;
