"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { loginUser } from "@/lib/auth/loginThunk";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { socialLoginThunk } from "@/lib/auth/socialLoginThunk";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please fill in all fields");
    }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      await dispatch(loginUser(email, password));
      router.push("/");
    } catch (err) {
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    if (!credential) {
      alert("Google login failed. Please try again.");
      return;
    }
    try {
      await dispatch(socialLoginThunk("google", credential));
      router.push("/");
    } catch (err) {
      alert("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Login failed:");
    alert("Login failed, please try again.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-primary-800 text-sm font-medium">Email</p>
        <input
          type="email"
          className="border border-primary-800 rounded-md outline-none px-3 py-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-primary-800 text-sm font-medium">Password</p>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-primary-800 rounded-md outline-none px-3 py-1"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary-700 hover:underline"
          >
            {showPassword ? (
              <i className="bi bi-eye-slash"></i>
            ) : (
              <i className="bi bi-eye"></i>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          id="remember-me"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          onChange={(e) => setRememberMe(e.target.checked)}
          checked={rememberMe}
        />
        <label htmlFor="remember-me" className="text-primary-800 text-sm">
          Remember Me
        </label>
      </div>

      <button
        onClick={handleLogin}
        className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
      >
        Log In
      </button>
      <div className="flex flex-col gap-2">
        <p className="text-primary-800 text-sm">
          Don't have an account?{" "}
          <a href="/signup/email" className="text-primary-700 hover:underline">
            Sign Up
          </a>
        </p>
        <p className="text-primary-800 text-sm">
          Forgot your password?{" "}
          <a
            href="/reset-password"
            className="text-primary-700 hover:underline"
          >
            Reset Password
          </a>
        </p>
      </div>

      <h2 className="text-2xl text-primary-800">Social Login</h2>
      <div className="flex flex-row gap-6">
        <button className="text-primary-700 text-4xl hover:text-primary-500">
          <i className="bi bi-apple"></i>
        </button>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={handleGoogleLoginError}
        />
        <button className="text-primary-700 text-4xl hover:text-primary-500">
          <i className="bi bi-facebook"></i>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
