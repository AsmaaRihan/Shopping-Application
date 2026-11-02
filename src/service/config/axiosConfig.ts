import axios from 'axios';
import { Alert } from 'react-native';
import config from '.';

const instance = axios.create({
  baseURL: config.URL,
  timeout: config.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(undefined, async error => {
  if (error.response.status === 401) {
    Alert.alert('Unauthorized! Please log in again.');
  } else if (error.response.status === 404) {
    console.error('Resource not found:', error.config.url);
  } else if (error.response?.status === 500) {
    console.error('Something went wrong:', error.message);
  }

  throw error;
});
export default instance;
