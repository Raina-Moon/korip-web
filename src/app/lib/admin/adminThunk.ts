import axios from "axios";
import { AppDispatch } from "../store/store";
import { logout } from "../auth/authSlice";

export const fetchAllUsers = async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/users`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    throw err;
  }
};

export const deleteUser = async (userId:number,dispatch: AppDispatch) => {
    try {
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/users/${userId}`,{
                withCredentials: true,
            })
            return res.data;
    } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
            dispatch(logout());
        }
        throw err;
    }
}
