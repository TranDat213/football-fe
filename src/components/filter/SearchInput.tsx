'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value ?? '');
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value ?? '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const newValue = (e.target as HTMLInputElement).value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-2.5 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Xóa tìm kiếm"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}