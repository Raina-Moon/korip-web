import axios from "axios";
import { AppDispatch } from "../store/store";
import { setUserOnly } from "./authSlice";

export const socialLoginThunk =
  (provider: string, accessToken: string) => async (dispatch: AppDispatch) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/social-login`,
      { provider, accessToken },
      {
        withCredentials: true,
      }
    );

    const { user } = res.data;
    dispatch(setUserOnly(user));
  };
