import axios from '../axios.config';

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/users/check-auth');
    return response.data.data;
  } catch (error) {
    console.log(error, 'Unable to verify auth');
    return false;
  }
};

export { isAuthenticated };
