import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: 'http://13.55.102.200/:5001', // live
  //baseURL : '',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
