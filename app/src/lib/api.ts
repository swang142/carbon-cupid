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
};
