"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const VerifyandResetPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const params = useSearchParams();
  const email = params.get("email") || "";
  const router = useRouter();

  useEffect(() => {
    setPasswordMatch(newPassword === confirmPassword);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;
    if (newPassword && !passwordRegex.test(newPassword)) {
      alert(
        "Password must be at least 10 characters long, contain uppercase, numbers, and special characters."
      );
    }
  }, [newPassword, confirmPassword]);

  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    if (val && i < 6) {
      document.getElementById(`code=${i + 1}`)?.focus();
    }
  };

  return (
    <div>
      <h2>Enter the code to {email}</h2>
      <div className="flex gap-2 my-4 justify-center">
        {code.map((digit, idx) => (
          <input
            type="text"
            key={idx}
            id={`code=$${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(idx, e.target.value)}
            className="border border-primary-700 rounded-md px-2 py-1 outline-none w-12 text-center"
            required
          />
        ))}
        <button className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500">
          Verify Code
        </button>
      </div>

      <div>
        <p>New Password</p>
        <input type="password"
        value={newPassword}
        disabled={!isCodeValid}
        placeholder={isCodeValid ? "Create new password" : "Verify code first"}
        className="border-primary-800 outline-none"/>
        <p>Confirm Password</p>
        <input type="password"
        value={confirmPassword}
        disabled={!isCodeValid}
        placeholder={isCodeValid ? "Confirm new password" : "Verify code first"}
        className="border-primary-800 outline-none"/>
      </div>
    </div>
  );
};

export default VerifyandResetPage;
