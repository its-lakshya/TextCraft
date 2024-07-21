import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:9000/' + 'api/v1', 
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json', // Set default headers for all requests
  },
});

export { axiosInstance };
