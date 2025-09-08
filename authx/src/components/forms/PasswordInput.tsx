"use client";

import { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter your password",
  name,
}: {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded p-2"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-2 text-sm text-blue-500"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
