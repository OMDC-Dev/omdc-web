import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '../api/routes';
import { API_STATES } from '../constants/ApiEnum';

type TApiResponse = {
  state: string;
  data: any;
  error: any;
};

async function useFetch(props: AxiosRequestConfig): Promise<TApiResponse> {
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
