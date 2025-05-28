import axios from "axios";
import { AppDispatch } from "../store/store";
import { setCredential } from "./authSlice";

export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    const res = await axios.post(
      "/v1/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const { token, user } = res.data;
    dispatch(setCredential({ token, user }));
  };
