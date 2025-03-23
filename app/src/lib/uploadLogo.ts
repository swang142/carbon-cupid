/**
 * Utility to upload a logo file to Supabase storage via the backend
 */

/**
 * Uploads an organization logo to Supabase storage through the backend API
 * @param file File to upload
 * @param organizationId Organization ID to use as part of the filename
 * @returns URL of the uploaded logo or null if upload failed
 */
export async function uploadLogo(
	file: File,
	organizationId: string | number
): Promise<string | null> {
	try {
		// Generate a unique file name with organization ID and timestamp
		const fileExtension = file.name.split(".").pop();
		const fileName = `org-${organizationId}-${Date.now()}.${fileExtension}`;

		// Create FormData
		const formData = new FormData();
		formData.append("file", file);
		formData.append("fileName", fileName);

		// Upload via backend API endpoint
		const apiUrl =
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
		const response = await fetch(`${apiUrl}/upload/logo`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Failed to upload logo");
		}

		const data = await response.json();
		return data.url;
	} catch (error) {
		console.error("Error uploading logo:", error);
		return null;
	}
}
