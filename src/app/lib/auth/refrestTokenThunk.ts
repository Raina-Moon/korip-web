import axios from "axios";
import { logout, setCredential } from "./authSlice";

export const refreshTokenThunk = () => async (dispatch: any) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );
    
    const newToken = res.data.accessToken;

    const userRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/user`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      })
    const user = userRes.data;
      dispatch(setCredential({ token: newToken, user }));
  } catch (err) {
    dispatch(logout());
  }
};
