import axios from '../axios.config';

const isAuthenticated = async () => {
  try {
    const response = await axios.get('/check-auth');
    return response.data.loggeIn;
  } catch (error) {
    console.log(error, 'Unable to verify auth');
  }
};

export { isAuthenticated };
