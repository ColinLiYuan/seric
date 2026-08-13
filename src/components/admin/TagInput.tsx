'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

interface Props {
  tags: string[];
  suggestions: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, suggestions, onChange, placeholder = 'Add tag...' }: Props) {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions that match input and aren't already selected
  const filtered = useMemo(() => {
    if (!input.trim()) return [];
    const q = input.trim().toLowerCase();
    return suggestions
      .filter(s => s.toLowerCase().includes(q) && !tags.includes(s))
      .slice(0, 8);
  }, [input, suggestions, tags]);

  const canCreate = input.trim() !== '' && !tags.includes(input.trim());

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [filtered.length]);

  function add(tag: string) {
    if (!tag.trim() || tags.includes(tag.trim())) return;
    onChange([...tags, tag.trim()]);
    setInput('');
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function remove(idx: number) {
    const n = [...tags];
    n.splice(idx, 1);
    onChange(n);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showDropdown && filtered.length > 0 && selectedIdx < filtered.length) {
        add(filtered[selectedIdx]);
      } else if (canCreate) {
        add(input.trim());
      }
      return;
    }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      remove(tags.length - 1);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowDropdown(true);
      setSelectedIdx(prev => Math.min(prev + 1, filtered.length > 0 ? filtered.length - 1 : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }

  const show = showDropdown && input && (filtered.length > 0 || canCreate);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1.5 p-2 min-h-[38px] border border-gray-200 rounded-lg bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 cursor-text"
        onClick={() => inputRef.current?.focus()}>
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
            {tag}
            <button onClick={(e) => { e.stopPropagation(); remove(i); }}
              className="hover:bg-blue-200 rounded-full p-0.5 -mr-0.5">
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowDropdown(true); }}
          onFocus={() => input && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[80px] border-none outline-none text-sm bg-transparent px-1 py-0.5"
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      </div>

      {/* Dropdown */}
      {show && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((s, i) => (
            <button
              key={s}
              onMouseDown={(e) => { e.preventDefault(); add(s); }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 flex items-center gap-2 ${i === selectedIdx ? 'bg-blue-50' : ''}`}
            >
              <span className="text-gray-400 text-xs">#</span>
              {s}
            </button>
          ))}
          {canCreate && !filtered.find(f => f === input.trim()) && (
            <button
              onMouseDown={(e) => { e.preventDefault(); add(input.trim()); }}
              className="w-full text-left px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 flex items-center gap-2"
            >
              <span className="text-blue-400 text-xs font-bold">+</span>
              Create &quot;{input.trim()}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
