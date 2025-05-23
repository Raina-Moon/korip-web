import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const HeaderBar = () => {
  const [select, setSelect] = useState("");
  const router = useRouter();

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
        <button value={select}>Language</button>
        <button onClick={() => router.push("/login")}>
          <i className="bi bi-person-circle text-primary-800 text-3xl"></i>
        </button>
      </div>

      {select && (
        <div>
          <select
            value={select}
            onChange={(e) => {
              setSelect(e.target.value);
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default HeaderBar;
