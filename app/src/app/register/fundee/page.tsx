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
	Input,
} from "@/components/ui";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { geocodeLocation } from "@/lib/geocode";

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];
const revenueRanges = [
	"0-100K",
	"100K-500K",
	"500K-1M",
	"1M-5M",
	"5M-10M",
	"10M+",
];
const fundingRanges = [
	"0",
	"<$100K",
	"$100K-$500K",
	"$500K-$1M",
	"$1M-$5M",
	"$5M-$10M",
	">$10M",
];
const mcdrTypes = [
	"Direct Air Capture",
	"Enhanced Weathering",
	"Ocean Alkalinity Enhancement",
	"Biomass Carbon Removal",
	"Biochar",
	"Other",
];
const projectStatuses = [
	"Planning",
	"Unregistered",
	"In Validation",
	"In Development",
	"Registration Requested",
	"Operational",
];
const teamSizes = ["1-10", "11-50", "51-200", "200-500", ">500"];

const RegisterFundeePage = () => {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const initialFormState = {
		organizationName: "",
		email: "",
		stage: "",
		website: "",
		industry: "",
		tagline: "",
		description: "",
		fundingNeeded: "",
		currentFunding: "",
		location: "",
		teamSize: "",
		foundingDate: null as Date | null,
		revenue: "",
		carbonCredits: "",
		expectedCredits: "",
		mcdrType: "",
		projectName: "",
		projectDescription: "",
		projectStatus: "Planning",
		certifier: "",
	};

	const [formData, setFormData] = useState(initialFormState);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		// For numeric fields, ensure value is not negative
		if (
			["carbonCredits", "expectedCredits", "fundingNeeded"].includes(name)
		) {
			// Convert to number and ensure it's non-negative
			const numValue = Math.max(0, Number(value));
			setFormData((prev) => ({ ...prev, [name]: numValue.toString() }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleDateChange = (date: Date | undefined) => {
		setFormData((prev) => ({ ...prev, foundingDate: date || null }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic validation
		const missingFields = [];
		if (!formData.organizationName) missingFields.push("Organization Name");
		if (!formData.email) missingFields.push("Email");
		if (!formData.stage) missingFields.push("Funding Stage");
		if (!formData.fundingNeeded) missingFields.push("Funding Needed");
		if (!formData.currentFunding) missingFields.push("Current Funding");
		if (!formData.location) missingFields.push("Location");
		if (!formData.mcdrType) missingFields.push("mCDR Type");
		if (!formData.teamSize) missingFields.push("Team Size");
		if (!formData.projectName) missingFields.push("Project Name");
		if (!formData.projectStatus) missingFields.push("Project Status");
		if (!formData.projectDescription)
			missingFields.push("Project Description");
		if (!formData.expectedCredits)
			missingFields.push("Expected Credits (Next 5 Years)");

		// Validate numeric fields are non-negative
		const numericErrors = [];
		if (parseInt(formData.fundingNeeded) < 0)
			numericErrors.push("Funding Needed cannot be negative");
		if (parseInt(formData.carbonCredits) < 0)
			numericErrors.push("Carbon Credits Issued cannot be negative");
		if (parseInt(formData.expectedCredits) < 0)
			numericErrors.push("Expected Credits cannot be negative");

		if (missingFields.length > 0) {
			console.log(
				`Validation failed: Missing fields: ${missingFields.join(", ")}`
			);

			toast({
				title: "Required Fields Missing",
				description: `Please fill in all required fields: ${missingFields.join(
					", "
				)}`,
				variant: "destructive",
				duration: 5000,
				className:
					"border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50",
			});
			return;
		}

		if (numericErrors.length > 0) {
			console.log(
				`Validation failed: Invalid values: ${numericErrors.join(", ")}`
			);

			toast({
				title: "Invalid Values",
				description: numericErrors.join(", "),
				variant: "destructive",
				duration: 5000,
				className:
					"border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Format data for API
			const fundeeData: any = {
				company_name: formData.organizationName,
				contact: formData.email,
				website: formData.website || "unknown",
				company_description:
					formData.description ||
					formData.tagline ||
					"No description provided",
				headcount: formData.teamSize || "1",
				project_name: formData.projectName || formData.organizationName,
				project_description:
					formData.projectDescription ||
					"No project description provided",
				project_status: formData.projectStatus || "Planning",
				mcdr_type: formData.mcdrType || "Other",
				founding_year: formData.foundingDate
					? formData.foundingDate.getFullYear()
					: new Date().getFullYear(),
				stage: formData.stage,
				funding_requested: parseInt(formData.fundingNeeded) || 0,
				certifier: formData.certifier || null,
				method: true, // Default value
				total_credits_issued: parseInt(formData.carbonCredits) || 0,
				expected_credits: parseInt(formData.expectedCredits) || 0,
				rawscore: 0, // This will be calculated by the backend
			};

			// Convert current funding from string range to numeric value
			if (formData.currentFunding) {
				let currentFundingValue = 0;

				// Parse funding range into numeric values
				if (formData.currentFunding === "0") {
					currentFundingValue = 0;
				} else if (formData.currentFunding === "<$100K") {
					currentFundingValue = 50000; // Average of 0-100K
				} else if (formData.currentFunding === "$100K-$500K") {
					currentFundingValue = 300000; // Average of 100K-500K
				} else if (formData.currentFunding === "$500K-$1M") {
					currentFundingValue = 750000; // Average of 500K-1M
				} else if (formData.currentFunding === "$1M-$5M") {
					currentFundingValue = 3000000; // Average of 1M-5M
				} else if (formData.currentFunding === "$5M-$10M") {
					currentFundingValue = 7500000; // Average of 5M-10M
				} else if (formData.currentFunding === ">$10M") {
					currentFundingValue = 15000000; // Arbitrary value for >10M
				}

				fundeeData.current_funding = currentFundingValue;
			} else {
				fundeeData.current_funding = 0;
			}

			// Get coordinates from location
			if (formData.location) {
				const coordinates = await geocodeLocation(formData.location);
				if (coordinates) {
					fundeeData.latitude = coordinates.latitude;
					fundeeData.longitude = coordinates.longitude;
				} else {
					throw new Error(
						"Could not geocode location. Please provide a valid location."
					);
				}
			} else {
				throw new Error("Location is required for registration.");
			}

			// Send data to API using the new method
			const result = await api.fundees.create(fundeeData);

			console.log(
				"Created fundee with ID:",
				result.data?.id || "ID not returned"
			);

			// Show success message immediately after creating the profile
			setIsSuccess(true);

			toast({
				title: "Success!",
				description: `Your fundee profile has been created successfully with ID: ${
					result.data?.id || "N/A"
				}`,
				variant: "success",
				duration: 5000,
				className:
					"border-2 border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50 shadow-lg",
			});

			// Reset form
			setFormData(initialFormState);

			// After 3 seconds, reset success state
			setTimeout(() => {
				setIsSuccess(false);
			}, 3000);

			// Call the score calculation API in the background (non-blocking)
			if (result.data?.id) {
				// Use a separate async function to handle the score calculation
				const calculateScores = async () => {
					try {
						console.log("Calculating scores in the background...");

						// Create an abort controller with a 15-second timeout
						const controller = new AbortController();
						const timeoutId = setTimeout(
							() => controller.abort(),
							15000
						);

						try {
							const scoreResponse = await fetch(
								`${
									process.env.NEXT_PUBLIC_API_URL ||
									"http://localhost:8080/api"
								}/calc-base-scores/${result.data.id}`,
								{
									method: "GET",
									signal: controller.signal,
								}
							);

							// Clear the timeout as soon as the request completes
							clearTimeout(timeoutId);

							if (scoreResponse.ok) {
								const scoreData = await scoreResponse.json();
								console.log(
									"Raw score data received:",
									scoreData
								);

								// Update fundee with scores - use default values if data is invalid
								const scoreUpdateData = {
									risk_score:
										scoreData[0] &&
										typeof scoreData[0].risk_score ===
											"number"
											? scoreData[0].risk_score
											: 0, // Default to 0 if invalid
									efficiency_score:
										scoreData[1] &&
										typeof scoreData[1].efficiency_score ===
											"number"
											? scoreData[1].efficiency_score
											: 0,
									impact_score:
										scoreData[2] &&
										typeof scoreData[2].impact_score ===
											"number"
											? scoreData[2].impact_score
											: 0,
								};

								console.log(
									"Formatted score data to save:",
									scoreUpdateData
								);

								// Update the fundee record with the scores
								await api.fundees.update(
									result.data.id,
									scoreUpdateData
								);

								console.log(
									"Updated fundee with scores:",
									scoreUpdateData
								);
							} else {
								console.error(
									"Failed to calculate scores:",
									await scoreResponse.text()
								);

								// Set default scores if calculation fails
								const defaultScores = {
									risk_score: 0,
									efficiency_score: 0,
									impact_score: 0,
								};

								console.log(
									"Using default scores:",
									defaultScores
								);

								// Still update with default scores
								await api.fundees.update(
									result.data.id,
									defaultScores
								);
							}
						} catch (fetchError) {
							clearTimeout(timeoutId);
							if (
								fetchError instanceof Error &&
								fetchError.name === "AbortError"
							) {
								console.warn(
									"Score calculation timed out after 15 seconds"
								);

								// Set default scores if calculation times out
								const defaultScores = {
									risk_score: 0,
									efficiency_score: 0,
									impact_score: 0,
								};

								console.log(
									"Using default scores due to timeout:",
									defaultScores
								);

								// Update with default scores
								await api.fundees.update(
									result.data.id,
									defaultScores
								);
							} else {
								console.error("Fetch error:", fetchError);

								// Set default scores if there's any fetch error
								const defaultScores = {
									risk_score: 0,
									efficiency_score: 0,
									impact_score: 0,
								};

								console.log(
									"Using default scores due to error:",
									defaultScores
								);

								// Update with default scores
								await api.fundees.update(
									result.data.id,
									defaultScores
								);
							}
						}
					} catch (error) {
						console.error(
							"Error calculating or updating scores:",
							error
						);
						// Don't show error to user, the profile was still created successfully
					}
				};

				// Start score calculation in the background without awaiting the result
				calculateScores();
			}
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to create fundee profile. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="pt-10 min-h-screen bg-gradient-to-b from-background to-secondary/10">
			<main className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-10 space-y-4 animate-fade-in">
						<h1 className="text-4xl font-bold tracking-tight text-primary">
							Register as a Fundee
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Join our platform to connect with innovative firms
							to invest in your project.
						</p>
					</div>

					<Card
						className={cn(
							"animate-scale-in shadow-xl border-2",
							isSuccess
								? "border-green-500/50 bg-green-50/10"
								: "border-primary/10"
						)}
					>
						<CardContent className="p-8">
							{isSuccess ? (
								<div className="py-16 text-center space-y-4">
									<div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<h2 className="text-2xl font-semibold text-foreground">
										Profile Created Successfully!
									</h2>
									<p className="text-muted-foreground">
										Thank you for joining our platform.
									</p>
								</div>
							) : (
								<form
									onSubmit={handleSubmit}
									className="space-y-8"
								>
									{/* Basic Information Section */}
									<div className="space-y-6">
										<h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">
											Basic Information
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<label
													htmlFor="organizationName"
													className="text-sm font-semibold text-foreground/80"
												>
													Organization Name*
												</label>
												<Input
													id="organizationName"
													name="organizationName"
													value={
														formData.organizationName
													}
													onChange={handleInputChange}
													placeholder="Your organization name"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="email"
													className="text-sm font-semibold text-foreground/80"
												>
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
										<h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">
											Organization Details
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<label
													htmlFor="stage"
													className="text-sm font-semibold text-foreground/80"
												>
													Funding Stage*
												</label>
												<Select
													value={formData.stage}
													onValueChange={(
														value: string
													) =>
														handleSelectChange(
															"stage",
															value
														)
													}
												>
													<SelectTrigger
														id="stage"
														className="w-full border border-input focus:ring-2 focus:ring-primary/50"
													>
														<SelectValue placeholder="Select funding stage" />
													</SelectTrigger>
													<SelectContent className="bg-popover border rounded-md shadow-md">
														{stages.map((stage) => (
															<SelectItem
																key={stage}
																value={stage}
																className="cursor-pointer z-150 hover:bg-accent"
															>
																{stage}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="website"
													className="text-sm font-semibold text-foreground/80"
												>
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
												<label
													htmlFor="industry"
													className="text-sm font-semibold text-foreground/80"
												>
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
												<label
													htmlFor="tagline"
													className="text-sm font-semibold text-foreground/80"
												>
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
											<label
												htmlFor="description"
												className="text-sm font-semibold text-foreground/80"
											>
												Organization Description
											</label>
											<textarea
												id="description"
												name="description"
												value={formData.description}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														description:
															e.target.value,
													}))
												}
												placeholder="Describe your organization and what you do"
												className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
											/>
										</div>
									</div>

									{/* Project Details Section */}
									<div className="space-y-6">
										<h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">
											Project Details
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<label
													htmlFor="projectName"
													className="text-sm font-semibold text-foreground/80"
												>
													Project Name*
												</label>
												<Input
													id="projectName"
													name="projectName"
													value={formData.projectName}
													onChange={handleInputChange}
													placeholder="Name of your carbon removal project"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="projectStatus"
													className="text-sm font-semibold text-foreground/80"
												>
													Project Status*
												</label>
												<Select
													value={
														formData.projectStatus
													}
													onValueChange={(
														value: string
													) =>
														handleSelectChange(
															"projectStatus",
															value
														)
													}
												>
													<SelectTrigger
														id="projectStatus"
														className="w-full border border-input focus:ring-2 focus:ring-primary/50"
													>
														<SelectValue placeholder="Select project status" />
													</SelectTrigger>
													<SelectContent className="bg-popover border rounded-md shadow-md">
														{projectStatuses.map(
															(status) => (
																<SelectItem
																	key={status}
																	value={
																		status
																	}
																	className="cursor-pointer hover:bg-accent"
																>
																	{status}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
												<p className="text-xs text-muted-foreground mt-1">
													Current development stage of
													your project
												</p>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="mcdrType"
													className="text-sm font-semibold text-foreground/80"
												>
													mCDR Type*
												</label>
												<Select
													value={formData.mcdrType}
													onValueChange={(
														value: string
													) =>
														handleSelectChange(
															"mcdrType",
															value
														)
													}
												>
													<SelectTrigger
														id="mcdrType"
														className="w-full border border-input focus:ring-2 focus:ring-primary/50"
													>
														<SelectValue placeholder="Select mCDR Type" />
													</SelectTrigger>
													<SelectContent className="bg-popover border rounded-md shadow-md">
														{mcdrTypes.map(
															(type) => (
																<SelectItem
																	key={type}
																	value={type}
																	className="cursor-pointer hover:bg-accent"
																>
																	{type}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="certifier"
													className="text-sm font-semibold text-foreground/80"
												>
													Certifier
												</label>
												<Input
													id="certifier"
													name="certifier"
													value={formData.certifier}
													onChange={handleInputChange}
													placeholder="e.g. Verra, Gold Standard"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="carbonCredits"
													className="text-sm font-semibold text-foreground/80"
												>
													Carbon Credits Issued (To
													Date)
												</label>
												<Input
													id="carbonCredits"
													name="carbonCredits"
													type="number"
													min="0"
													value={
														formData.carbonCredits
													}
													onChange={handleInputChange}
													placeholder="e.g. 1000"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="expectedCredits"
													className="text-sm font-semibold text-foreground/80"
												>
													Expected Credits (Next 5
													Years)*
												</label>
												<Input
													id="expectedCredits"
													name="expectedCredits"
													type="number"
													min="0"
													value={
														formData.expectedCredits
													}
													onChange={handleInputChange}
													placeholder="e.g. 5000"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
												<p className="text-xs text-muted-foreground mt-1">
													Estimated carbon credits to
													be issued in the next 5
													years
												</p>
											</div>
										</div>

										<div className="space-y-2">
											<label
												htmlFor="projectDescription"
												className="text-sm font-semibold text-foreground/80"
											>
												Project Description*
											</label>
											<textarea
												id="projectDescription"
												name="projectDescription"
												value={
													formData.projectDescription
												}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														projectDescription:
															e.target.value,
													}))
												}
												placeholder="Describe your carbon removal project in detail"
												className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
											/>
										</div>
									</div>

									{/* Financial & Team Information */}
									<div className="space-y-6">
										<h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">
											Financial & Team Information
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<label
													htmlFor="fundingNeeded"
													className="text-sm font-semibold text-foreground/80"
												>
													Funding Needed ($)*
												</label>
												<Input
													id="fundingNeeded"
													name="fundingNeeded"
													type="number"
													min="0"
													value={
														formData.fundingNeeded
													}
													onChange={handleInputChange}
													placeholder="e.g. 500000"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="currentFunding"
													className="text-sm font-semibold text-foreground/80"
												>
													Current Funding (All Time)*
												</label>
												<Select
													value={
														formData.currentFunding
													}
													onValueChange={(
														value: string
													) =>
														handleSelectChange(
															"currentFunding",
															value
														)
													}
												>
													<SelectTrigger
														id="currentFunding"
														className="w-full bg-background border border-input transition-all duration-200 focus:ring-2 focus:ring-primary/50"
													>
														<SelectValue placeholder="Select current funding" />
													</SelectTrigger>
													<SelectContent className="bg-popover border rounded-md shadow-md">
														{fundingRanges.map(
															(range) => (
																<SelectItem
																	key={range}
																	value={
																		range
																	}
																	className="cursor-pointer hover:bg-accent"
																>
																	{range}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
												<p className="text-xs text-muted-foreground mt-1">
													Total funding raised to date
												</p>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="revenue"
													className="text-sm font-semibold text-foreground/80"
												>
													Annual Revenue Range ($)
												</label>
												<Select
													value={formData.revenue}
													onValueChange={(
														value: string
													) =>
														handleSelectChange(
															"revenue",
															value
														)
													}
												>
													<SelectTrigger
														id="revenue"
														className="w-full bg-background border border-input transition-all duration-200 focus:ring-2 focus:ring-primary/50"
													>
														<SelectValue placeholder="Select revenue range" />
													</SelectTrigger>
													<SelectContent className="bg-popover border rounded-md shadow-md">
														{revenueRanges.map(
															(range) => (
																<SelectItem
																	key={range}
																	value={
																		range
																	}
																	className="cursor-pointer hover:bg-accent"
																>
																	{range}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="teamSize"
													className="text-sm font-semibold text-foreground/80"
												>
													Team Size*
												</label>
												<Select
													value={formData.teamSize}
													onValueChange={(
														value: string
													) =>
														handleSelectChange(
															"teamSize",
															value
														)
													}
												>
													<SelectTrigger
														id="teamSize"
														className="w-full border border-input focus:ring-2 focus:ring-primary/50"
													>
														<SelectValue placeholder="Select team size" />
													</SelectTrigger>
													<SelectContent className="bg-popover border rounded-md shadow-md">
														{teamSizes.map(
															(size) => (
																<SelectItem
																	key={size}
																	value={size}
																	className="cursor-pointer hover:bg-accent"
																>
																	{size}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="location"
													className="text-sm font-semibold text-foreground/80"
												>
													Location*
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
												<label
													htmlFor="foundingDate"
													className="text-sm font-semibold text-foreground/80"
												>
													Founding Date
												</label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className={cn(
																"w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-primary/50",
																!formData.foundingDate &&
																	"text-muted-foreground"
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{formData.foundingDate ? (
																format(
																	formData.foundingDate,
																	"PPP"
																)
															) : (
																<span>
																	Pick a date
																</span>
															)}
														</Button>
													</PopoverTrigger>
													<PopoverContent
														className="w-auto p-0"
														align="start"
													>
														<Calendar
															mode="single"
															selected={
																formData.foundingDate ||
																undefined
															}
															onSelect={
																handleDateChange
															}
															initialFocus
															className="rounded-md border shadow-md"
															weekStartsOn={1}
															classNames={{
																month: "space-y-4",
																caption:
																	"flex justify-center pt-1 relative items-center",
																caption_label:
																	"text-sm font-medium",
																nav: "space-x-1 flex items-center",
																nav_button:
																	"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
																nav_button_previous:
																	"absolute left-1",
																nav_button_next:
																	"absolute right-1",
																table: "w-full border-collapse space-y-1",
																head_row:
																	"flex w-full -ml-5",
																head_cell:
																	"w-full text-muted-foreground rounded-md text-[0.8rem] font-normal",
																row: "flex w-full mt-2",
																cell: "text-center h-9 w-9 p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
																day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
																day_selected:
																	"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
																day_today:
																	"bg-accent text-accent-foreground",
																day_outside:
																	"text-muted-foreground opacity-50",
																day_disabled:
																	"text-muted-foreground opacity-50",
																day_hidden:
																	"invisible",
															}}
														/>
													</PopoverContent>
												</Popover>
											</div>
										</div>
									</div>

									<div className="pt-6">
										<Button
											type="submit"
											className="w-full py-6 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<span className="flex items-center gap-2">
													<Loader2 className="h-4 w-4 animate-spin" />
													Creating Profile...
												</span>
											) : (
												"Create Fundee Profile"
											)}
										</Button>
									</div>
								</form>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
};

export default RegisterFundeePage;
