import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL, DRIVE_API } from '../api/routes';
import { API_STATES } from '../constants/ApiEnum';

type TApiResponse = {
  state: string;
  data: any;
  error: any;
};

async function useUploadPDF(props: AxiosRequestConfig): Promise<TApiResponse> {
  return axios({
    ...props,
    url: DRIVE_API,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((resData: AxiosResponse) => {
      return { state: API_STATES.OK, data: resData.data, error: [] };
    })
    .catch((err: AxiosError | any) => {
      return {
        state: API_STATES.ERROR,
        data: [],
        error: err.response?.data?.error,
      };
    });
}

export default useUploadPDF;
