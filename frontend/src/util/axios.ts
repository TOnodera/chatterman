import axios from 'axios';
import Config from '../Config/config';

const config = {
  withCredentials: true,
  baseURL: Config.baseUrl
};
const http = axios.create(config);

export default http;
