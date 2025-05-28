import axios from "axios";
import { store } from "../store/store";
import { refreshTokenThunk } from "../auth/refrestTokenThunk";

export const setupAxiosInterceptor = () => {
  axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await store.dispatch<any>(refreshTokenThunk());
        const newToken = store.getState().auth.token;

        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      }

      return Promise.reject(err);
    }
  );
};
