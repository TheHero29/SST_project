import axios from 'axios';

export const axiosInstance = axios.create({
  proxy: {
    host: 'localhost',
    port: 8081
    },
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${localStorage.getItem('token')}`
    },
});