// src/app/fundees/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Building2, Calendar, DollarSign, Globe, Mail, MapPin, BarChart3, Users } from "lucide-react";
import { api } from "@/lib/api";

// Function to format currency
function formatCurrency(amount: number | undefined) {
  if (!amount) return "$0";
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  } else {
    return `$${amount}`;
  }
}

// Function to determine industry from mcdr_type
function getIndustryTags(mcdrType: string): string[] {
  const industryMap: Record<string, string[]> = {
    'Direct Air Capture': ['Carbon Removal', 'Direct Air Capture', 'CleanTech'],
    'Ocean Alkalinity Enhancement': ['Carbon Removal', 'Ocean Tech', 'CleanTech'],
    'Enhanced Weathering': ['Carbon Removal', 'Geoscience', 'CleanTech'],
    'Biomass Carbon Removal': ['Carbon Removal', 'Biomass', 'CleanTech'],
    // Add more mappings as needed
  };
  
  return industryMap[mcdrType] || ['Carbon Removal', 'CleanTech'];
}

export default function FundeeDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculatingScores, setIsCalculatingScores] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fundee, setFundee] = useState<any>(null);
  const [transformedFundee, setTransformedFundee] = useState<any>(null);
  const [scores, setScores] = useState({
    match_score: 0,
    efficiency_score: 0,
    impact_score: 0
  });

  // Fetch fundee data and calculate scores
  useEffect(() => {
    async function fetchFundeeDetails() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch fundee details
        const response = await api.fundees.getById(id);
        
        if (response.success && response.data) {
          const rawFundee = response.data;
          setFundee(rawFundee);
          
          // Transform the data for UI
          const transformed = {
            id: rawFundee.id.toString(),
            companyName: rawFundee.company_name,
            tagline: rawFundee.project_name,
            description: rawFundee.company_description,
            logo: `/company-logos/${rawFundee.id}.png`, // Example path
            industry: getIndustryTags(rawFundee.mcdr_type),
            location: 'San Francisco, CA', // In a real app, use geocoding
            foundedYear: rawFundee.founding_year?.toString() || 'N/A',
            stage: rawFundee.stage,
            teamSize: rawFundee.headcount,
            revenue: formatCurrency(rawFundee.current_funding),
            fundingNeeded: formatCurrency(rawFundee.funding_requested),
            match: 0, // Will be updated with real score
            website: rawFundee.website || "#",
            contact: rawFundee.contact || "contact@example.com"
          };
          
          setTransformedFundee(transformed);
          setIsLoading(false);
          
          // Calculate scores from Flask API
          calculateScores(rawFundee.id);
        } else {
          throw new Error("Failed to fetch fundee data");
        }
      } catch (err: any) {
        console.error("Error fetching fundee:", err);
        setError(err.message || "Failed to load fundee data");
        setIsLoading(false);
      }
    }
    
    fetchFundeeDetails();
  }, [id]);

  // Calculate scores from Flask API
  const calculateScores = async (fundeeId: string | number) => {
    setIsCalculatingScores(true);
    
    try {
      // Default funder ID
      const funderId = 1;
      
      // Get scores from Flask API
      const result = await api.flask.calculateTopScores(fundeeId, funderId);
      
      if (result.success) {
        // Update scores state
        setScores(result.scores);
        
        // Update match score in transformed fundee
        if (transformedFundee) {
          setTransformedFundee(prev => ({
            ...prev,
            match: result.scores.match_score
          }));
        }
      }
    } catch (error) {
      console.error("Error calculating scores:", error);
    } finally {
      setIsCalculatingScores(false);
    }
  };

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
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4">Error Loading Fundee</h1>
            <p className="text-muted-foreground mb-6">
              {error}
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
    );
  }

  // Not found state
  if (!fundee || !transformedFundee) {
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
    );
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
                  backgroundImage: `url(${transformedFundee.logo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative z-10 bg-background/80 backdrop-blur-sm p-6 rounded-xl border shadow-sm flex items-center justify-center w-40 h-40">
                <img
                  src={transformedFundee.logo || "/placeholder.svg"}
                  alt={transformedFundee.companyName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="relative z-10 flex flex-col text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{transformedFundee.companyName}</h1>
                  <Badge variant="outline" className="font-medium px-3 py-1">
                    {transformedFundee.stage}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4 max-w-xl">{transformedFundee.tagline}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {transformedFundee.industry.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="flex items-center gap-1 font-medium px-3 py-1">
                  <BarChart3 className="h-4 w-4" />
                  {isCalculatingScores ? "Calculating..." : `${transformedFundee.match}% Match`}
                </Badge>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6 animate-slide-up">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Company Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">{transformedFundee.description}</p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Key Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Founded</p>
                        <p className="font-medium">{transformedFundee.foundedYear}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{transformedFundee.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Team Size</p>
                        <p className="font-medium">{transformedFundee.teamSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-medium">{transformedFundee.revenue}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Funding Requirements</h2>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-lg font-medium text-primary mb-2">{transformedFundee.fundingNeeded}</p>
                    <p className="text-muted-foreground">
                      {fundee.project_description || 
                      "This company is seeking funding to accelerate growth, expand their team, and scale operations globally."}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Match Score Analysis Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
                  <div className="space-y-4">
                    {/* Match Score */}
                    <div className="p-4 rounded-lg bg-secondary/10">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Overall Match</span>
                        <span className="font-medium">{scores.match_score}%</span>
                      </div>
                      <Progress value={scores.match_score} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Overall compatibility score based on all factors
                      </p>
                    </div>

                    {/* Top 3 Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Efficiency Score */}
                      <div className="p-3 rounded-lg bg-secondary/5">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Efficiency</span>
                          <span className="text-sm font-medium">{scores.efficiency_score}%</span>
                        </div>
                        <Progress value={scores.efficiency_score} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Credits generated per dollar invested
                        </p>
                      </div>

                      {/* Impact Score */}
                      <div className="p-3 rounded-lg bg-secondary/5">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Impact</span>
                          <span className="text-sm font-medium">{scores.impact_score}%</span>
                        </div>
                        <Progress value={scores.impact_score} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Total carbon removal potential
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {isCalculatingScores 
                        ? "Calculating scores..." 
                        : "Scores calculated based on historical data and projections."}
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

                    <Button variant="outline" className="w-full gap-2" asChild>
                      <a href={transformedFundee.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Quick Facts Section */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <div className="bg-muted px-4 py-3">
                    <h3 className="font-semibold">Quick Facts</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Founded</span>
                        <span className="font-medium">{transformedFundee.foundedYear}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Stage</span>
                        <span className="font-medium">{transformedFundee.stage}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="font-medium">{transformedFundee.location}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Team Size</span>
                        <span className="font-medium">{transformedFundee.teamSize}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Match Score</span>
                        <span className="font-medium text-primary">{transformedFundee.match}%</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">CDR Method</span>
                        <span className="font-medium">{fundee.mcdr_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Card */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <div className="bg-muted px-4 py-3">
                    <h3 className="font-semibold">Key Metrics</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Efficiency</span>
                        <span className="font-medium">{scores.efficiency_score}%</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Impact</span>
                        <span className="font-medium">{scores.impact_score}%</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Match</span>
                        <span className="font-medium text-primary">{scores.match_score}%</span>
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
  );
}