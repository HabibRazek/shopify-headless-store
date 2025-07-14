'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface SearchInputProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  placeholder = "Rechercher des produits...",
  initialValue = "",
  onSearch,
  className = "",
  autoFocus = false
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const router = useRouter();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If onSearch callback is provided, call it
    if (onSearch) {
      onSearch(value);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() && !onSearch) {
      // If no onSearch callback is provided, navigate to search page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 w-full pr-10"
          autoFocus={autoFocus}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </form>
  );
}
