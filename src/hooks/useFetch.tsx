import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '../api/routes';
import { API_STATES } from '../constants/ApiEnum';

async function useFetch(props: AxiosRequestConfig) {
  return axios({
    ...props,
    baseURL: BASE_URL,
  })
    .then((resData: AxiosResponse) => {
      return { state: API_STATES.OK, data: resData.data?.data, error: [] };
    })
    .catch((err: AxiosError) => {
      return { state: API_STATES.ERROR, data: [], error: err.response?.data };
    });
}

export default useFetch;
