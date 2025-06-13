import React, { useEffect, useRef, useState } from "react";

type PriceInputProps = {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
};

const PriceInput = ({ value, onChange, placeholder }: PriceInputProps) => {
    const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue((value ?? 0).toLocaleString());
  },[value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onChange(num);
      setDisplayValue(num.toLocaleString());
    } else {
        onChange(0);
        setDisplayValue("");
    }

      requestAnimationFrame(() => {
        if (inputRef.current) {
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      });
    }

  return (
    <input
      type="text"
      ref={inputRef}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode="numeric"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    />
  );
};

export default PriceInput;
