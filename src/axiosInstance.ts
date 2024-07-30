  import axios, { AxiosRequestConfig } from "axios";

  const axiosConfig: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
      "Access-Control-Allow-Origin": [
        process.env.REACT_APP_CLIENT_URL,
        process.env.REACT_APP_SERVER_URL,
      ].join(","),
      "Access-Control-Allow-Methods": "DELETE, POST, GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers":
        "Origin, Accept, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    },
    withCredentials: true,
  };

  const AxiosInstance = axios.create(axiosConfig);

  export default AxiosInstance;
