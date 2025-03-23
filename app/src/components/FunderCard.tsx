'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FunderData {
  id: number
  organization_name: string | null
  contact: string | null
  website: string | null
  description: string | null
  longitude: number
  latitude: number
  avg_investment_size: number | null
  num_investments: number | null
  last_investment_date: Date | null
  focus_areas: string[] | null
  funding_stages: string[] | null
  geographic_focus: string[] | null
  logo: string | null
}

interface FunderCardProps {
  funder: FunderData
  priority?: boolean
}

export function FunderCard({ funder, priority = false }: FunderCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      const visibleTimer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(visibleTimer)
    }, priority ? 100 : Math.random() * 300)

    return () => clearTimeout(timer)
  }, [priority])

  return (
    <Card
      className={cn(
        'card-hover overflow-hidden border bg-card h-full',
        'transition-all duration-500 ease-out transform',
        isLoaded ? 'opacity-100' : 'opacity-0',
        isVisible ? 'translate-y-0' : 'translate-y-4'
      )}
    >
      <CardContent className="p-0">
        <div className="relative h-40 bg-secondary/30 overflow-hidden">
          <div
            className={cn(
              'absolute inset-0 filter blur-xl opacity-20 transition-opacity duration-500',
              isLoaded ? 'opacity-20' : 'opacity-0'
            )}
            style={{
              backgroundImage: `url(${funder.logo || '/placeholder.svg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={funder.logo || '/placeholder.svg'}
              alt={funder.organization_name || 'Funder Logo'}
              className={cn(
                'max-h-20 max-w-full object-contain transition-all duration-700',
                isLoaded ? 'opacity-100 filter-none' : 'opacity-0 blur-md'
              )}
            />
          </div>
        </div>


        <div className="p-5 space-y-2">
          <h3 className="text-lg font-semibold">
            {funder.organization_name || 'Unnamed Organization'}
          </h3>

          {funder.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {funder.description}
            </p>
          )}


          {funder.focus_areas?.length ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {funder.focus_areas.slice(0, 3).map((area) => (
                <Badge key={area} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {funder.focus_areas.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{funder.focus_areas.length - 3}
                </Badge>
              )}
            </div>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex-col items-start gap-4">
        <div className="w-full h-px bg-border" />

        <div className="text-sm grid grid-cols-2 gap-3 w-full text-muted-foreground">
          <div>
            <span className="block font-medium text-foreground">Investments</span>
            {funder.num_investments ?? 'N/A'}
          </div>
          <div>
            <span className="block font-medium text-foreground">Avg. Investment</span>
            {funder.avg_investment_size !== null
              ? `$${funder.avg_investment_size.toLocaleString()}`
              : 'N/A'}
          </div>
          <div className="col-span-2">
            <span className="block font-medium text-foreground">Geographic Focus</span>
            {funder.geographic_focus?.join(', ') || 'N/A'}
          </div>
        </div>

        <div className="flex justify-between w-full items-center text-xs text-muted-foreground mt-2">
          <span>
            Lat: {funder.latitude.toFixed(2)}, Lon: {funder.longitude.toFixed(2)}
          </span>
          {funder.website && funder.website !== 'unknown' && (
            <a
              href={funder.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary font-medium"
            >
              Website <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
