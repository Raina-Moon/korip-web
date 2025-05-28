import axios from "axios"
import { logout, setCredential } from "./authSlice";

export const refreshTokenThunk = () => async (dispatch: any) => {
    try {
        const res = await axios.post("/v1/auth/refresh",{},{
            withCredentials: true,
        })
        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);

        const user = JSON.parse(localStorage.getItem("user") || "null");
        dispatch(setCredential({token: newToken, user}));
    } catch (err) {
        dispatch(logout());
    }
}