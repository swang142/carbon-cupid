"use client"
// import React, { useState } from 'react'
import { Input } from './ui/input'

// const SearchBar = () => {
//     const [searchQuery, setSearchQuery] = useState("")
//     const [searchResults, setSearchResults] = useState([])
//     const [isLoading, setIsLoading] = useState(false)
//     const [error, setError] = useState(null)

        
//   return (
//     <div className="flex flex-col justify-center items-center px-4">
//         <Input placeholders={["Search for a funder", "Search for a fundee"]} onChange={() => {}} onSubmit={() => {}} />
//     </div>>
//   )
// }

// export default SearchBar


import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = "Search by company, industry, or keywords...", className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  
  // Clear search input
  const handleClear = () => {
    setQuery("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative group w-full transition-all duration-300",
        isFocused && "scale-[1.01]",
        className
      )}
    >
      <div className={cn(
        "flex items-center w-full rounded-xl border bg-background transition-all duration-300",
        isFocused ? "shadow-md border-primary/30 ring-1 ring-primary/20" : "shadow-sm"
      )}>
        <div className="flex items-center pl-3 text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex h-12 w-full rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/90"
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="mr-1 h-7 w-7 rounded-full p-0 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
        
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={!query.trim()}
          className={cn(
            "mr-2 px-2 text-xs opacity-70 hover:opacity-100",
            !query.trim() && "pointer-events-none"
          )}
        >
          <span className="hidden sm:inline-block mr-1">Search</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
    </form>
  );
}