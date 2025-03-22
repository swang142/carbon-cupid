import { useState, useEffect } from "react";
import { FundeeCard, FundeeData } from "./FundeeCard";
import { Loader2 } from "lucide-react";

interface FundeeListProps {
  fundees: FundeeData[];
  isLoading: boolean;
  searchQuery?: string;
}

export function FundeeList({ fundees, isLoading, searchQuery }: FundeeListProps) {
  const [renderedFundees, setRenderedFundees] = useState<FundeeData[]>([]);
  
  // Effect to handle loading and progressive rendering
  useEffect(() => {
    if (isLoading) {
      setRenderedFundees([]);
      return;
    }
    
    // Simulate progressive loading for a nicer UX
    const renderFundees = async () => {
      setRenderedFundees([]);
      
      // Progressive rendering
      const batchSize = 4;
      for (let i = 0; i < fundees.length; i += batchSize) {
        const batch = fundees.slice(0, i + batchSize);
        setRenderedFundees(batch);
        // Small delay between batches for staggered effect
        if (i + batchSize < fundees.length) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      }
    };
    
    renderFundees();
  }, [fundees, isLoading]);
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <p className="text-muted-foreground animate-pulse">
            {searchQuery ? "Searching for matches..." : "Loading top fundees..."}
          </p>
        </div>
      </div>
    );
  }
  
  // If no results
  if (renderedFundees.length === 0 && !isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">No matches found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No fundees match "${searchQuery}". Try different keywords or clear your search.` 
              : "No fundees match your current filters. Try adjusting your filter criteria."}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderedFundees.map((fundee, index) => (
        <FundeeCard 
          key={fundee.id} 
          fundee={fundee} 
          priority={index < 3}
        />
      ))}
    </div>
  );
}