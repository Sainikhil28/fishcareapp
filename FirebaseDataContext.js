import React, { createContext, useState, useContext } from 'react';

const FirebaseDataContext = createContext();

export const FirebaseDataProvider = ({ children }) => {
  const [fishData, setFishData] = useState([]);

  return (
    <FirebaseDataContext.Provider value={{ fishData, setFishData }}>
      {children}
    </FirebaseDataContext.Provider>
  );
};

export const useFirebaseData = () => useContext(FirebaseDataContext);
