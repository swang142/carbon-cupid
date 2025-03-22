"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { mockFundees } from "@/data/mockFundees"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, Calendar, DollarSign, Globe, Mail, MapPin, BarChart3, Users } from "lucide-react"

export default function FundeeDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [fundee, setFundee] = useState(mockFundees.find((f) => f.id === id))

  // Simulate loading the fundee data
  useEffect(() => {
    setIsLoading(true)

    // Simulate API request delay
    const timer = setTimeout(() => {
      setFundee(mockFundees.find((f) => f.id === id))
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [id])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 pt-16">
          <div className="container px-4 py-8">
            <div className="animate-pulse max-w-screen-lg mx-auto">
              <div className="h-8 w-48 bg-muted rounded-md mb-4"></div>
              <div className="h-64 bg-muted rounded-xl mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-10 w-2/3 bg-muted rounded-md"></div>
                  <div className="h-4 w-full bg-muted rounded-md"></div>
                  <div className="h-4 w-full bg-muted rounded-md"></div>
                  <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-40 bg-muted rounded-xl"></div>
                  <div className="h-40 bg-muted rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Not found state
  if (!fundee) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4">Fundee Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The fundee you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/fundees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Fundees List
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 pt-16">
        <div className="container px-4 py-8">
          <div className="max-w-screen-lg mx-auto animate-fade-in">
            {/* Back button */}
            <Button variant="ghost" asChild className="mb-6 group" size="sm">
              <Link href="/fundees">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Fundees
              </Link>
            </Button>

            {/* Hero section */}
            <div className="relative bg-secondary/30 rounded-xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8 overflow-hidden animate-scale-in">
              <div
                className="absolute inset-0 opacity-10 blur-xl"
                style={{
                  backgroundImage: `url(${fundee.logo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative z-10 bg-background/80 backdrop-blur-sm p-6 rounded-xl border shadow-sm flex items-center justify-center w-40 h-40">
                <img
                  src={fundee.logo || "/placeholder.svg"}
                  alt={fundee.companyName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="relative z-10 flex flex-col text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{fundee.companyName}</h1>
                  <Badge variant="outline" className="font-medium px-3 py-1">
                    {fundee.stage}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4 max-w-xl">{fundee.tagline}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {fundee.industry.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="flex items-center gap-1 font-medium px-3 py-1">
                  <BarChart3 className="h-4 w-4" />
                  {fundee.match}% Match
                </Badge>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6 animate-slide-up">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Company Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">{fundee.description}</p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Key Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Founded</p>
                        <p className="font-medium">{fundee.foundedYear}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{fundee.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Team Size</p>
                        <p className="font-medium">{fundee.teamSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-medium">{fundee.revenue}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Funding Requirements</h2>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-lg font-medium text-primary mb-2">{fundee.fundingNeeded}</p>
                    <p className="text-muted-foreground">
                      This company is seeking funding to accelerate growth, expand their team, and scale operations
                      globally.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <div className="bg-primary px-4 py-3">
                    <h3 className="font-semibold text-primary-foreground">Contact</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <Button className="w-full gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Company
                    </Button>

                    <Button variant="outline" className="w-full gap-2">
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <div className="bg-muted px-4 py-3">
                    <h3 className="font-semibold">Quick Facts</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Founded</span>
                        <span className="font-medium">{fundee.foundedYear}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Stage</span>
                        <span className="font-medium">{fundee.stage}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="font-medium">{fundee.location}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Team Size</span>
                        <span className="font-medium">{fundee.teamSize}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Match Score</span>
                        <span className="font-medium text-primary">{fundee.match}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary flex flex-col items-center text-center">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Schedule a meeting</h3>
                  <p className="text-sm text-muted-foreground mb-3">Set up a call with the founders</p>
                  <Button size="sm" variant="secondary" className="w-full">
                    Book Meeting
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}