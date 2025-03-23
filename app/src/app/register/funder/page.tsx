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

const fundingStages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C"];
const averageInvestmentSizes = [
  "< $50K", 
  "$50K-$100K", 
  "$100K-$500K", 
  "$500K-$1M", 
  "$1M-$5M", 
  "$5M+"
];

const RegisterFunderPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    website: "",
    about: "",
    numberOfInvestments: "",
    lastInvestmentDate: null as Date | null,
    focusAreas: "",
    fundingStage: "",
    averageInvestmentSize: "",
    location: "",
    geographicFocus: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, lastInvestmentDate: date || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.contactEmail) {
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
            <h1 className="text-4xl font-bold tracking-tight text-primary">Register as a Funder</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our platform to connect with innovative carbon removal projects seeking funding.
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
                      <label htmlFor="name" className="text-sm font-semibold text-foreground/80">
                        Name*
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your organization or fund name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="contactEmail" className="text-sm font-semibold text-foreground/80">
                        Contact Email*
                      </label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="contact@organization.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
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
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="about" className="text-sm font-semibold text-foreground/80">
                      About
                    </label>
                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                      placeholder="Describe your organization, mission, and investment philosophy"
                      className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Investment Details */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">Investment Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="numberOfInvestments" className="text-sm font-semibold text-foreground/80">
                        Number of Investments
                      </label>
                      <Input
                        id="numberOfInvestments"
                        name="numberOfInvestments"
                        type="number"
                        value={formData.numberOfInvestments}
                        onChange={handleInputChange}
                        placeholder="e.g. 25"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastInvestmentDate" className="text-sm font-semibold text-foreground/80">
                        Last Investment Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-primary/50",
                              !formData.lastInvestmentDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.lastInvestmentDate ? (
                              format(formData.lastInvestmentDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.lastInvestmentDate || undefined}
                            onSelect={handleDateChange}
                            initialFocus
                            className="rounded-md border shadow-md"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="fundingStage" className="text-sm font-semibold text-foreground/80">
                        Funding Stage
                      </label>
                      <Select
                        value={formData.fundingStage}
                        onValueChange={(value: string) => handleSelectChange("fundingStage", value)}
                      >
                        <SelectTrigger id="fundingStage" className="w-full border border-black focus:ring-2 focus:ring-primary/50">
                          <SelectValue placeholder="Select preferred funding stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border rounded-md shadow-md">
                          {fundingStages.map((stage) => (
                            <SelectItem key={stage} value={stage} className="cursor-pointer z-150 hover:bg-accent">
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="averageInvestmentSize" className="text-sm font-semibold text-foreground/80">
                        Average Investment Size
                      </label>
                      <Select
                        value={formData.averageInvestmentSize}
                        onValueChange={(value: string) => handleSelectChange("averageInvestmentSize", value)}
                      >
                        <SelectTrigger id="averageInvestmentSize" className="w-full bg-background border border-input transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                          <SelectValue placeholder="Select average investment size" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border rounded-md shadow-md">
                          {averageInvestmentSizes.map((size) => (
                            <SelectItem key={size} value={size} className="cursor-pointer hover:bg-accent">
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">Focus & Coverage</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="focusAreas" className="text-sm font-semibold text-foreground/80">
                        Focus Areas
                      </label>
                      <Input
                        id="focusAreas"
                        name="focusAreas"
                        value={formData.focusAreas}
                        onChange={handleInputChange}
                        placeholder="e.g. Clean Energy, Carbon Capture, Sustainable Agriculture"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                      <p className="text-xs text-muted-foreground">Comma-separated list of your investment focus areas</p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="geographicFocus" className="text-sm font-semibold text-foreground/80">
                        Geographic Focus
                      </label>
                      <Input
                        id="geographicFocus"
                        name="geographicFocus"
                        value={formData.geographicFocus}
                        onChange={handleInputChange}
                        placeholder="e.g. North America, Europe, Global"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                      <p className="text-xs text-muted-foreground">Regions or countries where you prefer to invest</p>
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
