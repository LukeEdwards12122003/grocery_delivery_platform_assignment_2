import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://http://54.253.213.170/login:5001', // live
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
