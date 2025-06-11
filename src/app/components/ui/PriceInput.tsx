import React, { useRef } from "react";

type PriceInputProps = {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
};

const PriceInput = ({ value, onChange, placeholder }: PriceInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatNum = (value: string) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (!onlyNums) return "";
    return Number(onlyNums).toLocaleString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onChange(num);
      const formatted = formatNum(raw);
      const cursor = e.target.selectionStart ?? formatted.length;

      requestAnimationFrame(() => {
        if (inputRef.current) {
          const newPos = cursor - (formatted.length - raw.length);
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      });
    } else {
      onChange(0);
    }
  };

  return (
    <input
      type="text"
      ref={inputRef}
      value={formatNum(String(value))}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default PriceInput;
