"use client"
import { useState, useCallback, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FundeeFilter } from "@/components/FundeeFilter";
import { FundeeList } from "@/components/FundeeList";
import { mockFundees, searchFundees, filterFundees } from "@/data/mockFundees";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";


export default function FundeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [filteredFundees, setFilteredFundees] = useState(mockFundees);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate API request delay
    setTimeout(() => {
      const searchResults = searchFundees(query);
      setFilteredFundees(filterFundees(searchResults, filters));
      setIsLoading(false);
    }, 800);
  }, [filters]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    // Simulate API request delay
    setTimeout(() => {
      const searchResults = searchFundees(searchQuery);
      setFilteredFundees(filterFundees(searchResults, newFilters));
      setIsLoading(false);
    }, 600);
  }, [searchQuery]);

  // Initial data load
  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setFilteredFundees(mockFundees);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-16">
        <div className="container px-4 py-8 md:py-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className="md:col-span-3 lg:col-span-2">
                <div className="sticky top-24">
                  <FundeeFilter 
                    filters={filters} // Pass current filter state
                    onFiltersChange={handleFiltersChange} 
                  />
                </div>
              </div>
              
              <div className="md:col-span-9 lg:col-span-10">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h1 className="text-2xl font-semibold sm:text-3xl animate-fade-in">
                        Discover Fundees
                      </h1>
                    </div>
                    
                    <div className="w-full max-w-3xl">
                      <SearchBar 
                        onSearch={handleSearch} 
                        placeholder="Search by company, industry, or keywords..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-medium mb-1 animate-fade-in">
                        {searchQuery 
                          ? `Search results for "${searchQuery}"` 
                          : "Top matching fundees"}
                      </h2>
                      <p className="text-sm text-muted-foreground animate-fade-in">
                        {isLoading 
                          ? "Finding the best matches for you..." 
                          : `Showing ${filteredFundees.length} fundees`}
                      </p>
                    </div>
                    
                    <FundeeList 
                      fundees={filteredFundees}
                      isLoading={isLoading}
                      searchQuery={searchQuery}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
