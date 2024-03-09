// Import useState, useContext, useEffect from 'react'
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define UserRightsContext
const UserRightsContext = createContext();

// Export useUserRights custom hook
export const useUserRights = () => {
  return useContext(UserRightsContext);
};

// Export UserRightsProvider component
export const UserRightsProvider = ({ children }) => {
  const initialUserId = localStorage.getItem('userId');
  // Use useState and useEffect
  const [userRights, setUserRights] = useState([]);
  const [userId, setUserId] = useState(initialUserId);

  useEffect(() => {
    // useEffect logic goes here
  }, [userRights, userId]);

  return (
    <UserRightsContext.Provider value={{ userRights, setUserRights, userId, setUserId }}>
      {children}
    </UserRightsContext.Provider>
  );
};
