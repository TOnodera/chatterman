import axios from 'axios';

const config = {
    withCredentials: true,
    baseURL: 'http://localhost:3000'
};
const http = axios.create(config);

export default http;