"use client";

import React, { useState } from "react";
import { 
  Button, 
  Card, 
  CardContent,  
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input
} from "@/components/ui";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];
const revenueRanges = [
  "0-100K", 
  "100K-500K", 
  "500K-1M", 
  "1M-5M", 
  "5M-10M", 
  "10M+"
];

const RegisterFunderPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    stage: "",
    website: "",
    industry: "",
    tagline: "",
    description: "",
    fundingNeeded: "",
    location: "",
    teamSize: "",
    foundingDate: null as Date | null,
    revenue: "",
    carbonCredits: "",
    mcdr: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, foundingDate: date || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.organizationName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // This would be replaced with actual registration logic
    console.log("Registration data:", formData);
    toast({
      title: "Success!",
      description: "Your funder profile has been created successfully!",
    });
  };

  return (
    <div className="pt-10 min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Register as a Fundee</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our platform to connect with innovative firms to invest in your project.
            </p>
          </div>
          
          <Card className="animate-scale-in shadow-xl border-2 border-primary/10">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="organizationName" className="text-sm font-semibold text-foreground/80">
                        Organization Name*
                      </label>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        placeholder="Your organization name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                        Email*
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@organization.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Organization Details Section */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">Organization Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="stage" className="text-sm font-semibold text-foreground/80">
                        Funding Stage*
                      </label>
                      <Select
                        value={formData.stage}
                        onValueChange={(value: string) => handleSelectChange("stage", value)}
                      >
                        <SelectTrigger
                          id="stage"
                          className="w-full border border-black focus:ring-2 focus:ring-primary/50"
                        >
                          <SelectValue placeholder="Select funding stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border rounded-md shadow-md">
                          {stages.map((stage) => (
                            <SelectItem key={stage} value={stage} className="cursor-pointer z-150 hover:bg-accent">
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-semibold text-foreground/80">
                        Website
                      </label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="industry" className="text-sm font-semibold text-foreground/80">
                        Industry
                      </label>
                      <Input
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g. Renewable Energy"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="tagline" className="text-sm font-semibold text-foreground/80">
                        Tagline
                      </label>
                      <Input
                        id="tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleInputChange}
                        placeholder="A short tagline for your organization"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-semibold text-foreground/80">
                      Organization Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your organization and what you do"
                      className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Financial & Team Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">Financial & Team Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fundingNeeded" className="text-sm font-semibold text-foreground/80">
                        Funding Needed ($)
                      </label>
                      <Input
                        id="fundingNeeded"
                        name="fundingNeeded"
                        type="number"
                        value={formData.fundingNeeded}
                        onChange={handleInputChange}
                        placeholder="e.g. 500000"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="revenue" className="text-sm font-semibold text-foreground/80">
                        Revenue Range
                      </label>
                      <Select
                        value={formData.revenue}
                        onValueChange={(value: string) => handleSelectChange("revenue", value)}
                      >
                        <SelectTrigger id="revenue" className="w-full bg-background border border-input transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                          <SelectValue placeholder="Select revenue range" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border rounded-md shadow-md">
                          {revenueRanges.map((range) => (
                            <SelectItem key={range} value={range} className="cursor-pointer hover:bg-accent">
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="teamSize" className="text-sm font-semibold text-foreground/80">
                        Team Size
                      </label>
                      <Input
                        id="teamSize"
                        name="teamSize"
                        type="number"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        placeholder="e.g. 10"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-semibold text-foreground/80">
                        Location
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="foundingDate" className="text-sm font-semibold text-foreground/80">
                        Founding Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-primary/50",
                              !formData.foundingDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.foundingDate ? (
                              format(formData.foundingDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.foundingDate || undefined}
                            onSelect={handleDateChange}
                            initialFocus
                            className="rounded-md border shadow-md"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>


                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Funder Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RegisterFunderPage;
