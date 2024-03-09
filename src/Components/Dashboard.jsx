import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactionCounts, setTransactionCounts] = useState({
    today: 0,
    transactionIn: 0,
    pendingIn: 0,
    pendingOut: 0
  });
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      // Initialize counts to 0 before fetching data
      setTransactionCounts({
        today: 0,
        transactionIn: 0,
        pendingIn: 0,
        pendingOut: 0
      });

      const response = await axios.get(`/api/transactions?date=${selectedDate}`);
      const data = response.data;

      // Process data to get counts
      const todayCount = data.today.length;
      const transactionInCount = data.transactionIn.length;
      const pendingInCount = data.pendingIn.length;
      const pendingOutCount = data.pendingOut.length;

      // Incrementally update counts
      updateCount('today', 10);
      updateCount('transactionIn', 20);
      updateCount('pendingIn', 30);
      updateCount('pendingOut', 40);

      // Get top items
      const topItemsData = data.topItems.slice(0, 5); // Assuming you want top 5 items
      setTopItems(topItemsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateCount = (type, totalCount) => {
    let currentCount = 0;
    const increment = Math.ceil(totalCount / 100); // Divide total count by 100 for smoother animation

    const interval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= totalCount) {
        currentCount = totalCount;
        clearInterval(interval);
      }
      setTransactionCounts(prevCounts => ({
        ...prevCounts,
        [type]: currentCount
      }));
    }, 10); // Update every 10 milliseconds for smoother animation
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
    <div className='pt-10 mt-20 w-10/12 mx-auto'>
      <div className='m-5 flex items-center justify-end'>
        <label className='mr-5 font-semibold' htmlFor="datePicker">Select Date:</label>
        <input type="date" className='p-1' id="datePicker" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} />
      </div>

      <div className="container grid text-center tracking-wide md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-medium mb-2">Today's Transaction Count</h2>
          <p className="text-5xl font-bold">{transactionCounts.today}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg  font-medium mb-2">Transaction In Count</h2>
          <p className="text-5xl font-bold">{transactionCounts.transactionIn}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg  font-medium mb-2">Pending In Count</h2>
          <p className="text-5xl font-bold">{transactionCounts.pendingIn}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg  font-medium mb-2">Pending Out Count</h2>
          <p className="text-5xl font-bold">{transactionCounts.pendingOut}</p>
        </div>
      </div>

      <hr class=" mx-auto h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
      <h2 className='text-xl text-center mb-5'>Top Items</h2>
      <div className="container mx-auto mb-5 max-w-4xl overflow-x-auto">
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <table className='w-full'>
          <thead className="border-b-2 border-t-2 border-t-gray-400 border-black">
            <tr className="text-black">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">No. of Items</th>
            </tr>
          </thead>
          <tbody>
            {topItems.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.itemCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
