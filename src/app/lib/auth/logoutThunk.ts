import { AppDispatch } from "../store/store";
import { authApi } from "./authApi";
import { logout } from "./authSlice";

export const logoutUser = () => async (dispatch: AppDispatch) => {
    try {
        await dispatch(authApi.endpoints.logout.initiate({})).unwrap()
        dispatch(logout())
    } catch (err) {
        console.error("Logout failed:", err);
    }
} 