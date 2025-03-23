import { useState, useEffect } from "react"
import { FunderCard, FunderData } from "./FunderCard"
import { Loader2 } from "lucide-react"

interface FunderListProps {
  funders: FunderData[]
  isLoading: boolean
  searchQuery?: string
}

export function FunderList({ funders, isLoading, searchQuery }: FunderListProps) {
  const [renderedFunders, setRenderedFunders] = useState<FunderData[]>([])

  useEffect(() => {
    if (isLoading) {
      setRenderedFunders([])
      return
    }

    const renderFunders = async () => {
      setRenderedFunders([])

      const batchSize = 4
      for (let i = 0; i < funders.length; i += batchSize) {
        const batch = funders.slice(0, i + batchSize)
        setRenderedFunders(batch)
        if (i + batchSize < funders.length) {
          await new Promise(resolve => setTimeout(resolve, 150))
        }
      }
    }

    renderFunders()
  }, [funders, isLoading])

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <p className="text-muted-foreground animate-pulse">
            {searchQuery ? "Searching for funders..." : "Loading top funders..."}
          </p>
        </div>
      </div>
    )
  }

  if (renderedFunders.length === 0 && !isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">No matches found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No funders match "${searchQuery}". Try different keywords or clear your search.`
              : "No funders match your current filters. Try adjusting your filter criteria."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderedFunders.map((funder, index) => (
        <FunderCard key={funder.id} funder={funder} priority={index < 3} />
      ))}
    </div>
  )
}
