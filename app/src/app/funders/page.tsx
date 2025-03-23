"use client"

import { useState, useCallback, useEffect } from "react"
import { api } from "@/lib/api"
import { FunderData } from "@/components/FunderCard"
import { FunderList } from "@/components/FunderList"
import { SearchBar } from "@/components/SearchBar"
import { FunderFilter } from "@/components/FunderFilter"

export default function FundersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [allFunders, setAllFunders] = useState<FunderData[]>([])
  const [filteredFunders, setFilteredFunders] = useState<FunderData[]>([])

  useEffect(() => {
    async function fetchFunders() {
      setIsLoading(true)
      try {
        const response = await api.funders.getAll()
        if (response.success) {
          const mapped = response.data.map((funder: any): FunderData => ({
            ...funder,
            logo: funder.logo || null,
            focus_areas: funder.focus_areas || [],
            funding_stages: funder.funding_stages || [],
            geographic_focus: funder.geographic_focus || [],
          }))
          setAllFunders(mapped)
          setFilteredFunders(mapped)
        } else {
          console.error("Failed to fetch funders:", response)
        }
      } catch (err) {
        console.error("Error fetching funders:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFunders()
  }, [])

  const searchFunders = useCallback(
    (query: string) => {
      if (!query.trim()) return allFunders
      const lower = query.toLowerCase()

      return allFunders.filter((funder) =>
        funder.organization_name?.toLowerCase().includes(lower) ||
        funder.description?.toLowerCase().includes(lower) ||
        funder.funding_stages?.some(stage => stage.toLowerCase().includes(lower)) ||
        funder.geographic_focus?.some(loc => loc.toLowerCase().includes(lower))
      )
    },
    [allFunders]
  )

  // Filter logic
  const filterFunders = useCallback(
    (funders: FunderData[], filters: Record<string, string[]>) => {
      if (Object.keys(filters).length === 0) return funders

      return funders.filter((funder) => {
        for (const [key, values] of Object.entries(filters)) {
          if (values.length === 0) continue

          switch (key) {
            case "avg_investment_size":
              const size = funder.avg_investment_size ?? 0
              let sizeRange = ""
              if (size < 250000) sizeRange = "<$250K"
              else if (size < 1000000) sizeRange = "$250K–$1M"
              else if (size < 5000000) sizeRange = "$1M–$5M"
              else if (size < 10000000) sizeRange = "$5M–$10M"
              else sizeRange = ">$10M"
              if (!values.includes(sizeRange)) return false
              break

            case "funding_stages":
              if (!funder.funding_stages?.some(stage => values.includes(stage))) return false
              break

            case "geographic_focus":
              if (!funder.geographic_focus?.some(loc => values.includes(loc))) return false
              break

            default:
              break
          }
        }
        return true
      })
    },
    []
  )

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setIsLoading(true)

      setTimeout(() => {
        const searched = searchFunders(query)
        const filtered = filterFunders(searched, filters)
        setFilteredFunders(filtered)
        setIsLoading(false)
      }, 500)
    },
    [filters, searchFunders, filterFunders]
  )

  const handleFiltersChange = useCallback(
    (newFilters: Record<string, string[]>) => {
      setFilters(newFilters)
      setIsLoading(true)

      setTimeout(() => {
        const searched = searchFunders(searchQuery)
        const filtered = filterFunders(searched, newFilters)
        setFilteredFunders(filtered)
        setIsLoading(false)
      }, 500)
    },
    [searchQuery, searchFunders, filterFunders]
  )

  return (
    <div className="flex flex-col bg-background mt-1.5">
      <main className="flex-1">
        <div className="container px-4">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <div className="col-span-2">
              <div className="sticky top-28">
                <FunderFilter onFiltersChange={handleFiltersChange} />
              </div>
            </div>

            <div className="col-span-10 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold sm:text-3xl animate-fade-in">
                  Discover Funders
                </h1>
                <div className="w-full max-w-3xl">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search by organization, description, or region..."
                  />
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-1 animate-fade-in">
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : "All available funders"}
                  </h2>
                  <p className="text-sm text-muted-foreground animate-fade-in">
                    {isLoading
                      ? "Finding matching funders..."
                      : `Showing ${filteredFunders.length} funders`}
                  </p>
                </div>

                <FunderList
                  funders={filteredFunders}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}