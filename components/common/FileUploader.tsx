"use client";
import { useId, useRef, useState } from "react";

interface Props {
  accept: string;
  label: string;
  hint: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}

export function FileUploader({ accept, label, hint, multiple = true, disabled, onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const id = useId();

  const handle = (list: FileList | null) => {
    if (list && list.length) onFiles(Array.from(list));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled) handle(e.dataTransfer.files);
      }}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition sm:p-10 ${
        over ? "border-brand-600 bg-brand-50" : "border-brand-200 bg-white"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => handle(e.target.files)}
      />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-brand-600" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
      </svg>
      <p className="mt-3 text-base font-semibold text-ink">{label}</p>
      <p className="mt-1 text-sm text-ink-soft">{hint}</p>
      <label
        htmlFor={id}
        className={`btn btn-primary mt-5 ${disabled ? "pointer-events-none" : "cursor-pointer"} focus-within:outline focus-within:outline-2`}
      >
        Browse files
      </label>
    </div>
  );
}
