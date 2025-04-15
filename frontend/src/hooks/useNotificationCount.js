import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNotificationCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/seller/requests");
        setCount(res.data.length);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };
    
    fetchCount();
    // Optional: Poll for updates every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return { count, setCount }; 
};