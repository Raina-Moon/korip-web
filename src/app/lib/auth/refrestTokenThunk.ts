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
    localStorage.setItem("token", newToken);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      dispatch(setCredential({ token: newToken, user }));
    } else {
      dispatch(logout());
    }
  } catch (err) {
    dispatch(logout());
  }
};
