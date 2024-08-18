import React, { createContext, useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storedImageUrl = await AsyncStorage.getItem('storedImageUrl'); // Fetch stored image URL
        if (storedImageUrl) {
          setImage(storedImageUrl);
        } else {
          const storageRef = ref(storage, `Images/image-${Date.now()}`); // Default if no stored URL
          const url = await getDownloadURL(storageRef);
          setImage(url);
          await AsyncStorage.setItem('storedImageUrl', url); // Store the URL for future sessions
        }
      } catch (error) {
        console.log('Error fetching/storing image:', error);
      }
    };

    fetchImage();
  }, []);

  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
};
