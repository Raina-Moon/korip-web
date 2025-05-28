import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppSelector } from "../lib/store/hooks";

const HeaderBar = () => {
  const [select, setSelect] = useState("en");
  const [isHover, setIsHover] = useState(false);

  const router = useRouter();
  
  const user = useAppSelector((state) => state.auth.user);

  const languages = [
    { name: "English", code: "en" },
    { name: "한국어", code: "kr" },
  ];

  return (
    <div className="flex justify-between items-center px-5 border-b border-primary-800">
      <div>
        <Image
          src="/images/koriplogo.png"
          alt="korip logo"
          onClick={() => router.push("/")}
          width={100}
          height={100}
        />
      </div>
      <div className="flex items-center gap-4 pr-3">
        <select value={select} onChange={(e) => setSelect(e.target.value)}
          className="border border-primary-800 rounded-sm px-2 py-1">
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button onClick={() => router.push(user ? "/profile" : "/login")}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="relative">
          <i className="bi bi-person-circle text-primary-800 text-3xl"></i>

          {isHover && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 shadow-xl rounded p-3 z-50">
              {!user ? (
                <div>
                  <p>Login to Continue</p>
                  <button
                  onClick={() => router.push("/login")}
                  className="bg-primary-700 text-white rounded-md px-2 py-1 hover:bg-primary-500">Login</button>
                </div>
              ) : (
                <div>
                  <p>{user.nickname}</p>
                  <p>{user.email}</p>
                
                </div>
              )}
            </div>
          )}
        </button>
      </div>

    </div>
  );
};

export default HeaderBar;
