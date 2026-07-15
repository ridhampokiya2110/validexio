"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Select...", disabled, hasError }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically calculate whether to open upwards or downwards
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // If there is less than 250px below and more space above, open upwards
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isOpen]);

  const filteredOptions = options.filter(o => 
    o.label?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`w-full bg-[#1B1716]/5 border border-[#1B1716]/10 text-[#1B1716] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-cherry/50 transition-all flex justify-between items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${hasError ? 'border-red-500/50' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-[#1B1716]" : "text-[#1B1716]/50"} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#1B1716]/50 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div 
          className={`absolute z-[9999] w-full bg-white border border-[#1B1716]/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-60 ${
            position === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="p-3 border-b border-[#1B1716]/10 flex items-center bg-white">
            <Search className="w-4 h-4 text-[#1B1716]/40 mr-2 flex-shrink-0" />
            <input 
              type="text"
              className="w-full bg-transparent text-base sm:text-sm text-[#1B1716] focus:outline-none placeholder-[#1B1716]/40"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1 bg-white">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-sm text-[#1B1716]/50">No results found</div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer flex justify-between items-center ${value === option.value ? 'bg-cherry/10 text-cherry font-medium' : 'text-[#1B1716] hover:bg-[#1B1716]/5'}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 flex-shrink-0 ml-2 text-cherry" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
