"use client"

import { useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ScrollArea,
} from "@/components/ui"
import { cn } from "@/lib/utils"

const filterCategories = [
  {
    id: "avg_investment_size",
    name: "Avg Investment Size",
    options: ["<$250K", "$250K–$1M", "$1M–$5M", "$5M–$10M", ">$10M"],
  },
  {
    id: "funding_stages",
    name: "Funding Stages",
    options: ["Pre-Seed", "Seed", "Series A", "Growth"],
  },
  {
    id: "geographic_focus",
    name: "Geographic Focus",
    options: ["North America", "Canada", "Europe", "Global"],
  },
]

interface FunderFilterProps {
  onFiltersChange: (filters: Record<string, string[]>) => void
}

export function FunderFilter({ onFiltersChange }: FunderFilterProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({})

  const toggleFilter = (categoryId: string, option: string) => {
    setActiveFilters((prev) => {
      const current = prev[categoryId] || []
      const updated = current.includes(option)
        ? current.filter((val) => val !== option)
        : [...current, option]

      const newFilters = {
        ...prev,
        [categoryId]: updated,
      }

      if (newFilters[categoryId].length === 0) {
        delete newFilters[categoryId]
      }

      onFiltersChange(newFilters)
      return newFilters
    })
  }

  const toggleCategory = (categoryId: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    onFiltersChange({})
  }

  const activeFilterCount = Object.values(activeFilters).reduce(
    (acc, curr) => acc + curr.length,
    0
  )

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

        <ScrollArea className="pr-3 max-h-[calc(100vh-240px)] w-full">
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
                    className="w-full h-auto px-2 py-3 text-sm font-normal justify-start items-start"
                  >
                    <span className="w-4 h-4 mr-2 mt-1 shrink-0 flex items-center justify-center" />
                    <div className="flex flex-col flex-1 text-left">
                      <span className="font-medium break-words whitespace-normal">
                        {category.name}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "ml-2 shrink-0 h-4 w-4 transition-transform duration-200",
                        isOpen[category.id] && "transform rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="bg-background/30 rounded-b-md p-2">
                  <div className="grid grid-cols-1 gap-1 flex-wrap">
                    {category.options.map((option) => {
                      const isSelected = activeFilters[category.id]?.includes(option)
                      return (
                        <Button
                          key={option}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "justify-start px-2 text-sm font-normal w-full h-auto items-start",
                            isSelected && "bg-primary/10 text-primary"
                          )}
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                          onClick={() => toggleFilter(category.id, option)}
                        >
                          <span
                            className={cn(
                              "w-4 h-4 mr-2 mt-1 shrink-0 rounded border flex items-center justify-center",
                              isSelected ? "bg-primary border-primary" : "border-input"
                            )}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </span>
                          <span className="flex-1 break-words text-left">{option}</span>
                        </Button>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
