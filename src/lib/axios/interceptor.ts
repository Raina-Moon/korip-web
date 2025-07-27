import axios from "axios";
import { store } from "../store/store";
import { refreshTokenThunk } from "../auth/refrestTokenThunk";
import { logout } from "../auth/authSlice";

export const setupAxiosInterceptor = () => {
  axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/v1/auth/refresh") &&
        !originalRequest.url.includes("/v1/auth/login")
      ) {
        originalRequest._retry = true;

        try {
          await store.dispatch<any>(refreshTokenThunk());
          const newToken = store.getState().auth.accessToken;

          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch {
          store.dispatch(logout());
        }

        return Promise.reject(err);
      }
    }
  );
};
