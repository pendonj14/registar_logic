// src/hooks/useAutoFetchRequests.js
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axios';

// Default polling interval is 5000ms (5 seconds)
const useAutoFetchRequests = (intervalMs = 5000) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async (isBackground = false) => {
    try {
      // Only show loading spinner on the very first fetch
      if (!isBackground) setLoading(true);
      
      const response = await axiosInstance.get('/requests/');
      setRequests(response.data);
      
      if (!isBackground) setLoading(false);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err);
      if (!isBackground) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial Fetch
    fetchRequests(false);

    // 2. Set up Polling (Background Fetch)
    const intervalId = setInterval(() => {
      fetchRequests(true); // true = don't trigger loading spinner
    }, intervalMs);

    // 3. Cleanup on unmount (stops the timer when you leave the page)
    return () => clearInterval(intervalId);
  }, [fetchRequests, intervalMs]);

  // We return setRequests so the dashboard can still do "optimistic updates"
  // (updating the UI immediately when you click a button)
  return { requests, loading, error, setRequests, refresh: () => fetchRequests(true) };
};

export default useAutoFetchRequests;