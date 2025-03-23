// src/app/fundees/page.tsx
"use client";
import { useState, useCallback, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FundeeFilter } from "@/components/FundeeFilter";
import { FundeeList } from "@/components/FundeeList";
import { FundeeData } from "@/components/FundeeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";


function searchFundees(fundees: FundeeData[], query: string): FundeeData[] {
	if (!query.trim()) return fundees;

	const lowercaseQuery = query.toLowerCase();
	return fundees.filter((fundee) => {

		return (
			fundee.company_name.toLowerCase().includes(lowercaseQuery) ||
			fundee.mcdr_type.toLowerCase().includes(lowercaseQuery) ||
			(fundee.company_description &&
				fundee.company_description
					.toLowerCase()
					.includes(lowercaseQuery)) ||
			(fundee.project_description &&
				fundee.project_description
					.toLowerCase()
					.includes(lowercaseQuery))
		);
	});
}

function filterFundees(
	fundees: FundeeData[],
	filters: Record<string, string[]>
): FundeeData[] {
	if (Object.keys(filters).length === 0) return fundees;

	return fundees.filter((fundee) => {
		// Check each filter category
		for (const [key, values] of Object.entries(filters)) {
			if (values.length === 0) continue; 

			switch (key) {
				case "stage":
					if (!values.includes(fundee.stage)) return false;
					break;
				case "technology":
					if (!values.includes(fundee.mcdr_type)) return false;
					break;
				case "funding":
					// Convert funding_requested to appropriate range
					const fundingNeeded = fundee.funding_requested;
					let fundingRange = "";

					if (fundingNeeded < 500000) fundingRange = "<$500K";
					else if (fundingNeeded < 1000000)
						fundingRange = "$500K-$1M";
					else if (fundingNeeded < 5000000) fundingRange = "$1M-$5M";
					else if (fundingNeeded < 10000000)
						fundingRange = "$5M-$10M";
					else fundingRange = ">$10M";

					if (!values.includes(fundingRange)) return false;
					break;
				case "team":
					if (!values.includes(fundee.headcount)) return false;
					break;
			}
		}

		return true;
	});
}

export default function FundeesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<Record<string, string[]>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [isCalculatingScores, setIsCalculatingScores] = useState(false);
	const [allFundees, setAllFundees] = useState<FundeeData[]>([]);
	const [filteredFundees, setFilteredFundees] = useState<FundeeData[]>([]);
	const isMobile = useIsMobile();

	useEffect(() => {
		async function fetchFundees() {
			setIsLoading(true);
			try {
				const response = await api.fundees.getAll();
				if (response.success) {
					// First set fundees with default scores
					const fundeeData = response.data.map((fundee: any) => ({
						...fundee,
						logo: null,
						risk_score: Math.floor(Math.random() * 100),
						efficiency_score: Math.floor(Math.random() * 100),
						impact_score: Math.floor(Math.random() * 100),
						goal_alignment_score: null,
						location_score: null,
						funding_score: null,
						match: Math.floor(Math.random() * 100),
					}));

					setAllFundees(fundeeData);
					setFilteredFundees(fundeeData);
					setIsLoading(false);
					
					// Then calculate real scores
					calculateScores(fundeeData);
				} else {
					console.error("Failed to fetch fundees:", response);
					setIsLoading(false);
				}
			} catch (error) {
				console.error("Error fetching fundees:", error);
				setIsLoading(false);
			}
		}

		fetchFundees();
	}, []);

	// Calculate scores from Flask API
	const calculateScores = async (fundees: FundeeData[]) => {
		setIsCalculatingScores(true);
		
		try {
			// Process in batches to avoid overwhelming the API
			const BATCH_SIZE = 3; // Process 3 at a time
			const updatedFundees = [...fundees];
			
			// Default funder ID
			const funderId = 1;
			
			for (let i = 0; i < fundees.length; i += BATCH_SIZE) {
				const batchFundees = fundees.slice(i, i + BATCH_SIZE);
				
				// Calculate scores for each fundee in the batch
				const scorePromises = batchFundees.map(fundee => 
					api.flask.calculateTopScores(fundee.id, funderId)
				);
				
				// Wait for all calculations to complete
				const scoreResults = await Promise.all(scorePromises);
				
				// Update fundees with calculated scores
				scoreResults.forEach((result, index) => {
					if (result.success) {
						const fundeeIndex = i + index;
						if (fundeeIndex < updatedFundees.length) {
							updatedFundees[fundeeIndex] = {
								...updatedFundees[fundeeIndex],
								efficiency_score: result.scores.efficiency_score,
								impact_score: result.scores.impact_score,
								match: result.scores.match_score
							};
						}
					}
				});
			}
			
			// Update state with calculated scores
			setAllFundees(updatedFundees);
			
			// Update filtered list
			const filtered = filterFundees(
				searchFundees(updatedFundees, searchQuery), 
				filters
			);
			setFilteredFundees(filtered);
		} catch (error) {
			console.error("Error calculating scores:", error);
		} finally {
			setIsCalculatingScores(false);
		}
	};

	// Handle search
	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);
			setIsLoading(true);

			// Process the search
			setTimeout(() => {
				const searchResults = searchFundees(allFundees, query);
				setFilteredFundees(filterFundees(searchResults, filters));
				setIsLoading(false);
			}, 300);
		},
		[filters, allFundees]
	);

	const handleFiltersChange = useCallback(
		(newFilters: Record<string, string[]>) => {
			setFilters(newFilters);
			setIsLoading(true);

			// Process the filters
			setTimeout(() => {
				const searchResults = searchFundees(allFundees, searchQuery);
				setFilteredFundees(filterFundees(searchResults, newFilters));
				setIsLoading(false);
			}, 300);
		},
		[searchQuery, allFundees]
	);

	return (
		<div className="flex flex-col bg-background mt-1.5">
			<main className="flex-1">
				<div className="container px-4 py-">
					<div className="max-w-screen-2xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
							<div className="col-span-2">
								<div className="sticky top-35">
									<FundeeFilter
										onFiltersChange={handleFiltersChange}
									/>
								</div>
							</div>
							<div className="col-span-10">
								<div className="flex flex-col gap-8">
									<div className="flex flex-col gap-4">
										<div className="flex flex-wrap items-center justify-between gap-4">
											<h1 className="text-2xl font-semibold sm:text-3xl animate-fade-in">
												Discover Fundees
											</h1>
										</div>

										<div className="w-full max-w-3xl">
											<SearchBar
												onSearch={handleSearch}
												placeholder="Search by company, industry, or keywords..."
											/>
										</div>
									</div>

									<div>
										<div className="mb-6">
											<h2 className="text-lg font-medium mb-1 animate-fade-in">
												{searchQuery
													? `Search results for "${searchQuery}"`
													: "Top matching fundees"}
											</h2>
											<p className="text-sm text-muted-foreground animate-fade-in">
												{isLoading
													? "Finding the best matches for you..."
													: isCalculatingScores
													? "Calculating match scores..."
													: `Showing ${filteredFundees.length} fundees`}
											</p>
										</div>

										<FundeeList
											fundees={filteredFundees}
											isLoading={isLoading || isCalculatingScores}
											searchQuery={searchQuery}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}