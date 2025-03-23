"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FundingProgressBar } from "@/components/ui/progress-bar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ArrowUpRight, BarChart3, Calendar, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const googleMapsApiKey = process.env.NEXT_PUBLIC_MAP_API;

export interface FundeeData {
  id: number
  longitude: number,
  latitude: number,
  company_name: string
  company_description: string
  website: string | null
  contact: string | null
  headcount: string
  project_name: string
  project_description: string
  project_status: string
  method: boolean
  certifier: string | null
  mcdr_type: string
  founding_year: number
  stage: string
  current_funding: number
  funding_requested: number
  total_credits_issued: number
  expected_credits: number

  logo: string | null
  risk_score: number
  efficiency_score: number
  impact_score: number
  goal_alignment_score: number | null
  location_score: number | null
  funding_score: number | null
  match: number | null
}

interface FundeeCardProps {
  fundee: FundeeData
  priority?: boolean
}

export function FundeeCard({ fundee, priority = false }: FundeeCardProps) {
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
    <Drawer>
      <DrawerTrigger asChild>
        <Card
          className={cn(
            "card-hover overflow-hidden border bg-card h-full",
            "transition-all duration-500 ease-out transform",
            isLoaded ? "opacity-100" : "opacity-0",
            isVisible ? "translate-y-0" : "translate-y-4"
          )}
        >
        <CardContent className="p-0">
          <div className="relative h-40 bg-secondary/30 overflow-hidden">
            <div
              className={cn(
                "absolute inset-0 filter blur-xl opacity-20 transition-opacity duration-500",
                isLoaded ? "opacity-20" : "opacity-0"
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
                alt={fundee.company_name}
                className={cn(
                  "max-h-20 max-w-full object-contain transition-all duration-700",
                  isLoaded ? "opacity-100 filter-none" : "opacity-0 blur-md"
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
                  <h3 className="text-lg font-semibold">{fundee.company_name}</h3>
                  <Badge variant="outline" className="font-medium text-xs">
                    {fundee.stage}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-snug">
                {fundee.mcdr_type}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex-col items-start">
          <div className="w-full h-px bg-border" />

          <div className="grid grid-cols-2 w-full gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{fundee.headcount}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Founded {fundee.founding_year}</span>
            </div>

            <div className="col-span-2 flex flex-col gap-2 mt-1">
              <div className="flex gap-2 w-full">
                <p className="flex-1 text-sm ">
                  Funding Requested:
                </p>
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-xs flex-1 text-center">
                  {fundee.funding_requested}
                </Badge>

              </div>
              <div className="flex gap-2 w-full">
                <Badge variant="secondary" className="text-xs flex-1 text-center">
                  Revenue: {fundee.total_credits_issued}
                </Badge>
                <Badge variant="secondary" className="text-xs flex-1 text-center">
                  Expected: {fundee.expected_credits}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full items-center mt-1">
            <span className="text-xs text-muted-foreground">{fundee.longitude}, {fundee.latitude}</span>
            <div className="flex items-center text-primary text-sm font-medium">
              <span>View details</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </div>
        </CardFooter>
      </Card>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{fundee.company_name}</DrawerTitle>
          <DrawerDescription>{fundee.mcdr_type}</DrawerDescription>
          <FundingProgressBar
            current={fundee.current_funding}
            requested={fundee.funding_requested}
          />
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-6 text-sm">
          <p className="text-muted-foreground">{fundee.company_description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col gap-2 text-sm text-foreground">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Stage:</span>
                <span>{fundee.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Team Size:</span>
                <span>{fundee.headcount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Founded:</span>
                <span>{fundee.founding_year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Current Funding:</span>
                <span>${fundee.current_funding.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Funding Requested:</span>
                <span>${fundee.funding_requested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Credits Issued:</span>
                <span>{fundee.total_credits_issued.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Expected Credits (5 Years):</span>
                <span>{fundee.expected_credits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Certifier:</span>
                <span>{fundee.certifier || "N/A"}</span>
              </div>
            </div>

            <div className="flex justify-center items-start">
              <img
                src={fundee.logo || "/placeholder.svg"}
                alt={`${fundee.company_name} Logo`}
                className="max-h-24 object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mt-2">
            <div className="flex flex-col text-xs">
              <strong>Project Location Map:</strong>
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${fundee.latitude},${fundee.longitude}&zoom=12&size=500x300&maptype=roadmap&markers=color:red%7C${fundee.latitude},${fundee.longitude}&key=${googleMapsApiKey}`}
                alt="Project Location"
                className="mt-2 rounded-lg shadow"
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-foreground">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Project Status:</span>
                <span>{fundee.project_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Method Type:</span>
                <span>{fundee.method ? "Permanence-based" : "Non-permanence-based"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium">Project Name:</span>
                <span>{fundee.project_name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium">Project Description:</span>
                <span>{fundee.project_description}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-medium">Location:</span>
                <span>Longitude: {fundee.longitude}, Latitude: {fundee.latitude}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs mt-4">
            <div><strong>Location:</strong> Longitude: {fundee.longitude}, Latitude: {fundee.latitude}</div>
            <div><strong>Contact:</strong> {fundee.contact}</div>
            <div>
              <strong>Website:</strong>
              {fundee.website && fundee.website !== "unknown" ? (
                <a
                  href={fundee.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline ml-1"
                >
                  {fundee.website}
                </a>
              ) : " Unknown"}
            </div>
          </div>

          <DrawerClose className="mt-6 w-full inline-flex justify-center">
            <Button variant="link" className="w-full justify-center text-sm">Close</Button>
          </DrawerClose>
        </div>
      </DrawerContent>

    </Drawer>
  )
}
