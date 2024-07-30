import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://textcraft.onrender.com/' + 'api/v1', 
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export default axiosInstance;