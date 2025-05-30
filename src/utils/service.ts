import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";
import useUserStore from "@/store/modules/userStore";

interface Result {
  code: number;
  message: string;
}

interface ResultData<T> extends Result {
  data: T;
}

const config = {
  baseURL: import.meta.env.VITE_APP_BASE_API as string, // 请求基础路径
  timeout: 5000, // 请求超时时间，这里的单位是毫秒
};

const errorHandler = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      ElMessage.error("请求失败！请您稍后重试");
      break;
    case 401:
      ElMessage.error("登录失效！请您重新登录");
      router.replace("/login");
      break;
    case 403:
      ElMessage.error("当前账号无权限访问！");
      router.replace("/403");
      break;
    case 404:
      ElMessage.error("你所访问的资源不存在！");
      router.replace("/404");
      break;
    case 405:
      ElMessage.error("请求方式错误！请您稍后重试");
      break;
    case 408:
      ElMessage.error("请求超时！请您稍后重试");
      break;
    case 500:
      ElMessage.error("服务异常！");
      router.replace("/500");
      break;
    case 502:
      ElMessage.error("网关错误！");
      break;
    case 503:
      ElMessage.error("服务不可用！");
      break;
    case 504:
      ElMessage.error("网关超时！");
      break;
    default:
      ElMessage.error("请求失败！");
  }
};

class FlowerTipRequest {
  instance: AxiosInstance;

  public constructor(instanceConfig: AxiosRequestConfig) {
    this.instance = axios.create(instanceConfig);

    // 请求拦截器
    this.instance.interceptors.request.use((config) => {
      const userStore = useUserStore();
      if (userStore.token) {
        config.headers["token"] = userStore.token;
      }
      return config;
    });

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.log(error, "@@@error");
        const { response } = error;
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf("timeout") !== -1)
          ElMessage.error("请求超时！请您稍后重试");
        if (error.message.indexOf("Network Error") !== -1)
          ElMessage.error("网络错误！请您稍后重试");
        // 根据返回的状态码，处理对应的错误逻辑
        if (response) errorHandler(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到500页面
        if (!window.navigator.onLine) router.replace("/500");
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.instance.get<typeof params, ResultData<T>>(url, params);
  }

  post<T>(
    url: string,
    data: object | string,
    _config = {}
  ): Promise<ResultData<T>> {
    return this.instance.post<typeof data, ResultData<T>>(url, data, _config);
  }

  put<T>(url: string, params?: object, _config = {}): Promise<ResultData<T>> {
    return this.instance.put<typeof params, ResultData<T>>(
      url,
      params,
      _config
    );
  }

  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.instance.delete<typeof params, ResultData<T>>(url, params);
  }
}

export default new FlowerTipRequest(config);
