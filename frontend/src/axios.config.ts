import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://textcraft.onrender.com/' + 'api/v1', 
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});


axiosInstance.interceptors.request.use(
  (config) => {
    // Assuming `getToken` is a function that retrieves the Bearer token
    const token = localStorage.getItem('accessToken'); // Or use any method to get your token

    // Check if the request is for login or register endpoints
    if (config.url && !config.url.includes('/login') && !config.url.includes('/register')) {
      if (token) {
        // Attach the Bearer token to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    // Handle the error if any
    return Promise.reject(error);
  }
);

export default axiosInstance;