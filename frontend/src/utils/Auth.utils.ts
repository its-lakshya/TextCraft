import axios from '../axios.config';

const isAuthenticated = async () => {
  if (localStorage.getItem('isAuthenticated') !== 'true') {
    try {
      const response = await axios.get('/users/check-auth');
      console.log(response.data.loggedIn)
      return response.data.loggedIn;
    } catch (error) {
      console.log(error, 'Unable to verify auth');
      return false;
    }
  } else {
    return true;
  }
};

export { isAuthenticated };
