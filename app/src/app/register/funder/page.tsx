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

const fundingStages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];
const averageInvestmentSizes = [
	"< $50K",
	"$50K-$100K",
	"$100K-$500K",
	"$500K-$1M",
	"$1M-$5M",
	"$5M+",
];

const RegisterFunderPage = () => {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const initialFormState = {
		name: "",
		contactEmail: "",
		website: "",
		about: "",
		numberOfInvestments: "",
		lastInvestmentDate: null as Date | null,
		focusAreas: "",
		fundingStage: [] as string[],
		averageInvestmentSize: "",
		location: "",
		geographicFocus: "",
	};

	const [formData, setFormData] = useState(initialFormState);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleMultiSelectChange = (name: string, value: string) => {
		setFormData((prev) => {
			const currentValues = [
				...(prev[name as keyof typeof prev] as string[]),
			];
			if (currentValues.includes(value)) {
				return {
					...prev,
					[name]: currentValues.filter((item) => item !== value),
				};
			} else {
				return { ...prev, [name]: [...currentValues, value] };
			}
		});
	};

	const handleDateChange = (date: Date | undefined) => {
		setFormData((prev) => ({ ...prev, lastInvestmentDate: date || null }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic validation
		const missingFields = [];
		if (!formData.name) missingFields.push("Name");
		if (!formData.contactEmail) missingFields.push("Contact Email");

		if (missingFields.length > 0) {
			console.log(
				`Validation failed: Missing fields: ${missingFields.join(", ")}`
			);

			// Add visual indicators to the required fields that are empty
			const nameInput = document.getElementById("name");
			const emailInput = document.getElementById("contactEmail");

			if (!formData.name && nameInput) {
				nameInput.classList.add("border-red-500", "focus:ring-red-500");
			}

			if (!formData.contactEmail && emailInput) {
				emailInput.classList.add(
					"border-red-500",
					"focus:ring-red-500"
				);
			}

			toast({
				title: "Required Fields Missing",
				description: `Please fill in all required fields: ${missingFields.join(
					", "
				)}`,
				variant: "destructive",
				duration: 5000, // 5 seconds
				className:
					"border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Format data for API
			const funderData: any = {
				organization_name: formData.name,
				contact: formData.contactEmail,
				website: formData.website || null,
				description: formData.about || null,
				num_investments: formData.numberOfInvestments
					? Math.max(1, parseInt(formData.numberOfInvestments))
					: 1,
				last_investment_date: formData.lastInvestmentDate || null,
				funding_stages:
					formData.fundingStage.length > 0
						? formData.fundingStage
						: null,
				focus_areas: formData.focusAreas
					? formData.focusAreas.split(",").map((area) => area.trim())
					: null,
				geographic_focus: formData.geographicFocus
					? formData.geographicFocus
							.split(",")
							.map((area) => area.trim())
					: null,
			};

			// Handle average investment size conversion from string to number
			if (formData.averageInvestmentSize) {
				let avgSize = 0;

				// Parse investment size ranges into numeric values (in thousands)
				if (formData.averageInvestmentSize === "< $50K") {
					avgSize = 25000; // Average of 0-50K
				} else if (formData.averageInvestmentSize === "$50K-$100K") {
					avgSize = 75000; // Average of 50K-100K
				} else if (formData.averageInvestmentSize === "$100K-$500K") {
					avgSize = 300000; // Average of 100K-500K
				} else if (formData.averageInvestmentSize === "$500K-$1M") {
					avgSize = 750000; // Average of 500K-1M
				} else if (formData.averageInvestmentSize === "$1M-$5M") {
					avgSize = 3000000; // Average of 1M-5M
				} else if (formData.averageInvestmentSize === "$5M+") {
					avgSize = 7500000; // Arbitrary value for >5M
				}

				funderData.avg_investment_size = avgSize;
			}

			// Get coordinates from location
			if (formData.location) {
				const coordinates = await geocodeLocation(formData.location);
				if (coordinates) {
					funderData.latitude = coordinates.latitude;
					funderData.longitude = coordinates.longitude;
				}
			}

			// Send data to API
			const result = await api.funders.create(funderData);

			// Log the created funder with its newly assigned ID
			console.log(
				"Created funder with ID:",
				result.data?.id || "ID not returned"
			);

			setIsSuccess(true);

			toast({
				title: "Success!",
				description: `Your funder profile has been created successfully with ID: ${
					result.data?.id || "N/A"
				}`,
				variant: "success",
				duration: 5000, // 5 seconds
				className:
					"border-2 border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50 shadow-lg",
			});

			// Reset form
			setFormData(initialFormState);

			// After 3 seconds, reset success state
			setTimeout(() => {
				setIsSuccess(false);
			}, 3000);
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to create funder profile. Please try again.",
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
							Register as a Funder
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Join our platform to connect with innovative carbon
							removal projects seeking funding.
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
													htmlFor="name"
													className="text-sm font-semibold text-foreground/80"
												>
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
												<label
													htmlFor="contactEmail"
													className="text-sm font-semibold text-foreground/80"
												>
													Contact Email*
												</label>
												<Input
													id="contactEmail"
													name="contactEmail"
													type="email"
													value={
														formData.contactEmail
													}
													onChange={handleInputChange}
													placeholder="contact@organization.com"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
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
													htmlFor="location"
													className="text-sm font-semibold text-foreground/80"
												>
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
											<label
												htmlFor="about"
												className="text-sm font-semibold text-foreground/80"
											>
												About
											</label>
											<textarea
												id="about"
												name="about"
												value={formData.about}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														about: e.target.value,
													}))
												}
												placeholder="Describe your organization, mission, and investment philosophy"
												className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
											/>
										</div>
									</div>

									{/* Investment Details */}
									<div className="space-y-6">
										<h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">
											Investment Details
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<label
													htmlFor="numberOfInvestments"
													className="text-sm font-semibold text-foreground/80"
												>
													Number of Past Investments
												</label>
												<Input
													id="numberOfInvestments"
													name="numberOfInvestments"
													type="number"
													min="1"
													value={
														formData.numberOfInvestments
													}
													onChange={handleInputChange}
													placeholder="e.g. 25"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="lastInvestmentDate"
													className="text-sm font-semibold text-foreground/80"
												>
													Last Investment Date
												</label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className={cn(
																"w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-primary/50",
																!formData.lastInvestmentDate &&
																	"text-muted-foreground"
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{formData.lastInvestmentDate ? (
																format(
																	formData.lastInvestmentDate,
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
																formData.lastInvestmentDate ||
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

											<div className="space-y-2">
												<label
													htmlFor="fundingStage"
													className="text-sm font-semibold text-foreground/80"
												>
													Preferred Funding Stages
												</label>
												<div className="border rounded-md p-3 space-y-2 border-input bg-background">
													{fundingStages.map(
														(stage) => (
															<div
																key={stage}
																className="flex items-center space-x-2"
															>
																<input
																	type="checkbox"
																	id={`stage-${stage}`}
																	checked={(
																		formData.fundingStage as string[]
																	).includes(
																		stage
																	)}
																	onChange={() =>
																		handleMultiSelectChange(
																			"fundingStage",
																			stage
																		)
																	}
																	className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
																/>
																<label
																	htmlFor={`stage-${stage}`}
																	className="text-sm"
																>
																	{stage}
																</label>
															</div>
														)
													)}
												</div>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="averageInvestmentSize"
													className="text-sm font-semibold text-foreground/80"
												>
													Average Investment Size
												</label>
												<Select
													value={
														formData.averageInvestmentSize
													}
													onValueChange={(
														value: string
													) =>
														handleSelectChange(
															"averageInvestmentSize",
															value
														)
													}
												>
													<SelectTrigger
														id="averageInvestmentSize"
														className="w-full bg-background border border-input transition-all duration-200 focus:ring-2 focus:ring-primary/50"
													>
														<SelectValue placeholder="Select average investment size" />
													</SelectTrigger>
													<SelectContent className="bg-popover border rounded-md shadow-md">
														{averageInvestmentSizes.map(
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
										</div>
									</div>

									{/* Focus Areas */}
									<div className="space-y-6">
										<h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">
											Focus & Coverage
										</h2>
										<div className="grid grid-cols-1 gap-6">
											<div className="space-y-2">
												<label
													htmlFor="focusAreas"
													className="text-sm font-semibold text-foreground/80"
												>
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
												<p className="text-xs text-muted-foreground">
													Comma-separated list of your
													investment focus areas
												</p>
											</div>

											<div className="space-y-2">
												<label
													htmlFor="geographicFocus"
													className="text-sm font-semibold text-foreground/80"
												>
													Geographic Focus
												</label>
												<Input
													id="geographicFocus"
													name="geographicFocus"
													value={
														formData.geographicFocus
													}
													onChange={handleInputChange}
													placeholder="e.g. North America, Europe, Global"
													className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
												/>
												<p className="text-xs text-muted-foreground">
													Regions or countries where
													you prefer to invest
												</p>
											</div>
										</div>
									</div>

									<div className="pt-6">
										<Button
											type="submit"
											className="w-full py-6 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<span className="flex items-center gap-2">
													<Loader2 className="h-4 w-4 animate-spin" />
													Creating Profile...
												</span>
											) : (
												"Create Funder Profile"
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

export default RegisterFunderPage;
