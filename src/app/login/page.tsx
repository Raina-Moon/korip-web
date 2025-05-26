"use client";

import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      return alert("Please fill in all fields");
    }
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
            {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
          </button>
              </div>
      </div>
      <button
        onClick={handleLogin}
        className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
      >
        Log In
      </button>
    </div>
  );
};

export default LoginPage;
