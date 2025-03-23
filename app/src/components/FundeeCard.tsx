"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowUpRight, BarChart3, Calendar, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FundeeData {
  id: string
  companyName: string
  logo: string
  stage: string
  industry: string[]
  fundingNeeded: string
  location: string
  teamSize: string
  revenue: string
  projectedRevenue: string
  foundedYear: number
  match: number
  description: string
}

interface FundeeCardProps {
  fundee: FundeeData
  priority?: boolean
}

export function FundeeCard({ fundee, priority = false }: FundeeCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Simulate loading and animate entry
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsLoaded(true)

        // Stagger the entry animation slightly for a nicer effect
        const visibleTimer = setTimeout(() => {
          setIsVisible(true)
        }, 50)

        return () => clearTimeout(visibleTimer)
      },
      priority ? 100 : Math.random() * 300,
    )

    return () => clearTimeout(timer)
  }, [priority])

  return (
    <Link href={`/fundee/${fundee.id}`}>
      <Card
        className={cn(
          "card-hover overflow-hidden border bg-card h-full",
          "transition-all duration-500 ease-out transform",
          isLoaded ? "opacity-100" : "opacity-0",
          isVisible ? "translate-y-0" : "translate-y-4",
        )}
      >
        <CardContent className="p-0">
          <div className="relative h-40 bg-secondary/30 overflow-hidden">
            <div
              className={cn(
                "absolute inset-0 filter blur-xl opacity-20 transition-opacity duration-500",
                isLoaded ? "opacity-20" : "opacity-0",
              )}
              style={{
                backgroundImage: `url(${fundee.logo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={fundee.logo || "/placeholder.svg"}
                alt={fundee.companyName}
                className={cn(
                  "max-h-20 max-w-full object-contain transition-all duration-700",
                  isLoaded ? "opacity-100 filter-none" : "opacity-0 blur-md",
                )}
              />
            </div>
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="flex items-center gap-1 font-medium px-2.5 py-1">
                <BarChart3 className="h-3.5 w-3.5" />
                {fundee.match}% Match
              </Badge>
            </div>
          </div>

          <div className="p-5">
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{fundee.companyName}</h3>
                  <Badge variant="outline" className="font-medium text-xs">
                    {fundee.stage}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {fundee.industry.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-normal text-xs">
                    {tag}
                  </Badge>
                ))}
                {fundee.industry.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{fundee.industry.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex-col items-start gap-4">
          <div className="w-full h-px bg-border" />

          <div className="grid grid-cols-2 w-full gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{fundee.teamSize}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Founded {fundee.foundedYear}</span>
            </div>
            <div className="col-span-2 mt-1">
              <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-xs">
                {fundee.fundingNeeded} funding needed
              </Badge>
            </div>
          </div>

          <div className="flex justify-between w-full items-center mt-1">
            <span className="text-xs text-muted-foreground">{fundee.location}</span>
            <div className="flex items-center text-primary text-sm font-medium">
              <span>View details</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

