import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect} from 'expo-router';
import config from "./config";

const api = axios.create({
    baseURL: config.apiBaseUrl
})

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await AsyncStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        await AsyncStorage.removeItem("access_token");
        return <Redirect href="/" />;
      }
      return Promise.reject(error);
    }
  );
  

export default api;
  