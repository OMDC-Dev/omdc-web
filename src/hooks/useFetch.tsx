import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '../api/routes';
import { API_STATES } from '../constants/ApiEnum';

type TApiResponse = {
  state: string;
  data: any;
  error: any;
};

async function useFetch(props: AxiosRequestConfig): Promise<TApiResponse> {
  const userToken = await localStorage.getItem('token');

  let headers: any = {};

  if (userToken) {
    console.log('User Auth');

    headers.Authorization = `Bearer ${userToken}`;
  }

  return axios({
    ...props,
    baseURL: BASE_URL,
    headers: { ...headers, ...props.headers },
  })
    .then((resData: AxiosResponse) => {
      return { state: API_STATES.OK, data: resData.data?.data, error: [] };
    })
    .catch((err: AxiosError | any) => {
      return {
        state: API_STATES.ERROR,
        data: [],
        error: err.response?.data?.error,
      };
    });
}

export default useFetch;
