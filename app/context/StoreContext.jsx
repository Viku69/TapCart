import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  useEffect(() => {
    (async () => {
      const savedId = await AsyncStorage.getItem('store_id');
      if (savedId) setSelectedStoreId(parseInt(savedId));
    })();
  }, []);

  const changeStore = async (id) => {
    setSelectedStoreId(id);
    await AsyncStorage.setItem('store_id', String(id));
  };

  return (
    <StoreContext.Provider value={{ selectedStoreId, changeStore }}>
      {children}
    </StoreContext.Provider>
  );
};
