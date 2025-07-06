"use client"

import { Provider } from "react-redux";
import { store } from "../store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setupAxiosInterceptor } from "../axios/interceptor";

setupAxiosInterceptor();

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>

    <Provider store={store}>{children}</Provider>
    </GoogleOAuthProvider>
  );
}