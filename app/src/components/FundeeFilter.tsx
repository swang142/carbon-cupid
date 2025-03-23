import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
} from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Filter categories and options
const filterCategories = [
  {
    id: "stage",
    name: "Stage",
    options: ["Seed", "Pre-Seed", "Growth", "Series A"],
  },
  {
    id: "mcdr_type",
    name: "Technology",
    options: ["Direct ocean capture", "Ocean alkalinity enhancement (electrochemical)", "Biomass growing/harvesting/sinking", "Agriculture Forestry and Other Land Use", "Energy industries (renewable/non-renewable sources); Transport"],
  },
  {
    id: "funding_requested",
    name: "Funding Needed",
    options: ["<$500K", "$500K-$1M", "$1M-$5M", "$5M-$10M", ">$10M"],
  },
  {
    id: "location",
    name: "Location",
    options: ["Canada", "Other"],
  },
  {
    id: "team",
    name: "Team Size",
    options: ["1-10", "11-50", "51-200", ">200"],
  },
  {
    id: "total_credits_issued",
    name: "Revenue",
    options: ["Pre-revenue", "<$100K", "$100K-$1M", "$1M-$10M", ">$10M"],
  },
  {
    id: "expected_credits",
    name: "Expected Revenue over Next 5 Years",
    options: ["<$100K", "$100K-$1M", "$1M-$10M", ">$10M"],
  }
];

export function FundeeFilter({ onFiltersChange }: { onFiltersChange: (filters: Record<string, string[]>) => void }) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});

  // Toggle filter option selection
  const toggleFilter = (categoryId: string, option: string) => {
    setActiveFilters((prev) => {
      const categoryFilters = prev[categoryId] || [];
      const updatedFilters = categoryFilters.includes(option)
        ? categoryFilters.filter((item) => item !== option)
        : [...categoryFilters, option];

      const newFilters = {
        ...prev,
        [categoryId]: updatedFilters,
      };

      // Remove empty categories
      if (newFilters[categoryId].length === 0) {
        delete newFilters[categoryId];
      }

      // Call the parent callback
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  // Toggle category collapsible
  const toggleCategory = (categoryId: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({});
    onFiltersChange({});
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).reduce(
    (acc, filters) => acc + filters.length,
    0
  );

  return (
    <div className="bg-card rounded-xl border shadow-sm w-full animate-fade-in">
      <div className="p-4 flex flex-col gap-1">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b">
            {Object.entries(activeFilters).map(([categoryId, options]) =>
              options.map((option) => (
                <Badge 
                  key={`${categoryId}-${option}`}
                  variant="secondary"
                  className="px-2 py-1 gap-1"
                >
                  {option}
                  <X
                    className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => toggleFilter(categoryId, option)}
                  />
                </Badge>
              ))
            )}
          </div>
        )}
        
        <ScrollArea className="pr-3 max-h-[calc(100vh-240px)]">
          <div className="flex flex-col gap-1">
            {filterCategories.map((category) => (
              <Collapsible
                key={category.id}
                open={isOpen[category.id]}
                onOpenChange={() => toggleCategory(category.id)}
                className="rounded-md overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex justify-between bg-background/50 p-3 h-auto"
                  >
                    <span className="font-medium break-words">{category.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen[category.id] && "transform rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-background/30 rounded-b-md p-2">
                  <div className="grid grid-cols-1 gap-1 flex-wrap">
                    {category.options.map((option) => {
                      const isSelected = activeFilters[category.id]?.includes(option);
                      return (
                        <Button
                          key={option}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "justify-start h-8 px-2 text-sm font-normal break-words",
                            isSelected && "bg-primary/10 text-primary"
                          )}
                          onClick={() => toggleFilter(category.id, option)}
                        >
                          <span className={cn(
                            "w-4 h-4 mr-2 rounded border flex items-center justify-center",
                            isSelected ? "bg-primary border-primary" : "border-input"
                          )}>
                            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                          </span>
                          {option}
                        </Button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}