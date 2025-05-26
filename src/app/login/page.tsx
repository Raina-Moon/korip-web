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
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-primary-800 text-sm font-medium">Password</p>
        <input
          type="password"
          className="border border-primary-800 rounded-md outline-none px-3 py-1"
        />
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
