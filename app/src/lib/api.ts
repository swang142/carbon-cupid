const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * API client for backend services
 */
export const api = {
	/**
	 * Funders API methods
	 */
	funders: {
		/**
		 * Create a new funder profile
		 * Automatically assigns next ID by incrementing the max ID in the database
		 * @param funderData - Funder data to be submitted
		 * @returns Promise with the created funder data
		 */
		create: async (funderData: any) => {
			try {
				// First, get all funders to find the highest ID
				const allFundersResponse = await fetch(
					`${API_BASE_URL}/funders`
				);

				if (!allFundersResponse.ok) {
					const errorData = await allFundersResponse.json();
					throw new Error(
						errorData.error ||
							"Failed to fetch funders for ID increment"
					);
				}

				const allFundersData = await allFundersResponse.json();
				const allFunders = allFundersData.data || [];

				// Find the highest ID
				let maxId = 0;
				if (allFunders.length > 0) {
					maxId = Math.max(
						...allFunders.map((funder: any) => funder.id || 0)
					);
				}

				// Assign the next ID
				const dataWithId = {
					...funderData,
					id: maxId + 1,
				};

				// Now create the funder with the incremented ID
				const response = await fetch(`${API_BASE_URL}/funders`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dataWithId),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || "Failed to create funder profile"
					);
				}

				return response.json();
			} catch (error) {
				console.error("Error creating funder:", error);
				throw error;
			}
		},

		/**
		 * Get all funders
		 */
		getAll: async () => {
			const response = await fetch(`${API_BASE_URL}/funders`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to fetch funders");
			}

			return response.json();
		},

		/**
		 * Get a specific funder by ID
		 */
		getById: async (id: string) => {
			const response = await fetch(`${API_BASE_URL}/funders/${id}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to fetch funder");
			}

			return response.json();
		},
	},

	/**
	 * Fundees API methods
	 */
	fundees: {
		/**
		 * Create a new fundee profile
		 * @param fundeeData - Fundee data to be submitted
		 * @returns Promise with the created fundee data
		 */
		create: async (fundeeData: any) => {
			try {
				// First, get all fundees to find the highest ID
				const allFundeesResponse = await fetch(
					`${API_BASE_URL}/fundees`
				);

				if (!allFundeesResponse.ok) {
					const errorData = await allFundeesResponse.json();
					throw new Error(
						errorData.error ||
							"Failed to fetch fundees for ID increment"
					);
				}

				const allFundeesData = await allFundeesResponse.json();
				const allFundees = allFundeesData.data || [];

				// Find the highest ID
				let maxId = 0;
				if (allFundees.length > 0) {
					maxId = Math.max(
						...allFundees.map((fundee: any) => fundee.id || 0)
					);
				}

				// Assign the next ID
				const dataWithId = {
					...fundeeData,
					id: maxId + 1,
				};

				// Now create the fundee with the incremented ID
				const response = await fetch(`${API_BASE_URL}/fundees`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dataWithId),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || "Failed to create fundee profile"
					);
				}

				return response.json();
			} catch (error) {
				console.error("Error creating fundee:", error);
				throw error;
			}
		},

		/**
		 * Get all fundees
		 */
		getAll: async () => {
			const response = await fetch(`${API_BASE_URL}/fundees`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to fetch fundees");
			}

			return response.json();
		},

		/**
		 * Get a specific fundee by ID
		 */
		getById: async (id: string) => {
			const response = await fetch(`${API_BASE_URL}/fundees/${id}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to fetch fundee");
			}

			return response.json();
		},

		/**
		 * Update an existing fundee
		 * @param id - ID of the fundee to update
		 * @param fundeeData - Updated fundee data
		 * @returns Promise with the updated fundee data
		 */
		update: async (id: string | number, fundeeData: any) => {
			try {
				const response = await fetch(`${API_BASE_URL}/fundees/${id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(fundeeData),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || "Failed to update fundee"
					);
				}

				return response.json();
			} catch (error) {
				console.error("Error updating fundee:", error);
				throw error;
			}
		},
	},

	/**
	 * Flask API methods for advanced calculations
	 */
	flask: {
		/**
		 * Calculate top three scores (match, efficiency, impact) for a fundee
		 * @param fundeeId - ID of the fundee
		 * @param funderId - ID of the funder (defaults to 1)
		 */
		calculateTopScores: async (
			fundeeId: string | number,
			funderId: string | number = 1
		) => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/flask/calculate-match`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fundee_id: fundeeId,
							funder_id: funderId,
						}),
					}
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || "Failed to calculate scores"
					);
				}

				const data = await response.json();

				if (data.success) {
					// Extract the three most important scores
					return {
						success: true,
						scores: {
							match_score: data.match_score || 0,
							efficiency_score:
								data.components?.efficiency_score || 0,
							impact_score: data.components?.impact_score || 0,
						},
					};
				} else {
					throw new Error(data.error || "Failed to calculate scores");
				}
			} catch (error) {
				console.error("Error calculating scores:", error);
				return {
					success: false,
					scores: {
						match_score: 0,
						efficiency_score: 0,
						impact_score: 0,
					},
				};
			}
		},

		/**
		 * Calculate all scores for a fundee (full match analysis)
		 * @param fundeeId - ID of the fundee
		 * @param funderId - ID of the funder (defaults to 1)
		 */
		calculateFullScores: async (
			fundeeId: string | number,
			funderId: string | number = 1
		) => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/flask/calculate-match`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fundee_id: fundeeId,
							funder_id: funderId,
						}),
					}
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || "Failed to calculate scores"
					);
				}

				return response.json();
			} catch (error) {
				console.error("Error calculating full scores:", error);
				return {
					success: false,
					match_score: 0,
					components: {
						efficiency_score: 0,
						impact_score: 0,
						goal_alignment_score: 0,
						location_match_score: 0,
						funding_capability_match_score: 0,
					},
				};
			}
		},
	},
};
