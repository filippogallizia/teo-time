import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ENDPOINT } from '../api';
import { HttpError } from './HttpErrorService';
import { StatusCodes } from 'http-status-codes';
import { history } from '../component/Router';
import SessionService from './SessionService';

const config: AxiosRequestConfig = {
  baseURL: ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
};

class HttpService {
  protected http: AxiosInstance;
  public accessToken: string | undefined | null = '';
  public requests = new Map<string, Promise<any>>();

  constructor() {
    this.http = Axios.create(config);

    this.accessToken = '';

    this.http.interceptors.request.use(async (request: AxiosRequestConfig) => {
      if (this.accessToken) {
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${this.accessToken}`,
        };
      }
      return request;
    });

    this.http.interceptors.response.use(
      // @ts-expect-error
      async (response: AxiosResponse<any>) => {
        return response.data;
      },
      async (error: any) => {
        const httpError: HttpError | null = HttpError.error(error);
        // On conflict tries to get a new token and does the request again
        //if (httpError?.statusCode === StatusCodes.CONFLICT) {
        //  const hasNewToken: boolean = await SessionService.refreshToken();
        //  if (hasNewToken) {
        //    return await this.http.request(error.config);
        //  }
        if (httpError?.statusCode === StatusCodes.UNAUTHORIZED) {
          SessionService.logOut();
          history.push('/login');
        }
        return await Promise.reject(httpError);
      }
    );
  }

  public get<T>(url: string): Promise<T>;
  public get<T, K extends object>(url: string, params: K): Promise<T>;
  public get<T, K extends object>(url: string, params?: K): Promise<T> {
    /**
     *
     * To reuse the same promise in case the same request is done at the same time
     * but in different components/places
     *
     */
    const requestKey = `${url}${params ? `_${JSON.stringify(params)}` : ''}`;
    const request = this.requests.get(requestKey);
    if (request) {
      return request;
    }

    this.requests.set(
      requestKey,
      this.http
        .get(url, {
          params,
          //  paramsSerializer: HttpUtils.paramsSerializer,
        })
        .finally(() => this.requests.delete(requestKey))
    );

    return this.requests.get(requestKey) as Promise<T>;
  }

  public async post<T, K = any>(
    url: string,
    data?: K,
    config?: AxiosRequestConfig | undefined
  ): Promise<T> {
    return await this.http.post(url, data, config);
  }

  public async put<T, K = any>(
    url: string,
    data?: K,
    config?: AxiosRequestConfig | undefined
  ): Promise<T> {
    return await this.http.put(url, data, config);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig | undefined
  ): Promise<T> {
    return await this.http.delete<T, T>(url, config);
  }

  public async patch<T, K = any>(
    url: string,
    data?: K,
    config?: AxiosRequestConfig | undefined
  ): Promise<T> {
    return await this.http.patch(url, data, config);
  }

  //  public async upload<T, K = any>(
  //    method: 'POST' | 'PUT',
  //    url: string,
  //    model: K,
  //    files: File[]
  //  ): Promise<T> {
  //    return await this.http.request({
  //      method,
  //      url,
  //      data: HttpUtils.formData(files, model),
  //      headers: {
  //        'Content-Type': 'multipart/form-data',
  //      },
  //    });
  //  }
}
export default new HttpService();
