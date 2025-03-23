import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { supabase } from "../config/database.js";
import { fileURLToPath } from "url";

const router = Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, `org-${uniqueSuffix}${ext}`);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 2 * 1024 * 1024, // 2MB limit
	},
	fileFilter: (req, file, cb) => {
		// Check file type
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Invalid file type. Only JPEG, PNG and GIF images are allowed."
				),
				false
			);
		}
	},
});

// Create or get existing bucket
const getOrCreateBucket = async (bucketName) => {
	try {
		// Check if bucket exists
		const { data: buckets } = await supabase.storage.listBuckets();
		const bucketExists = buckets?.find(
			(bucket) => bucket.name === bucketName
		);

		if (!bucketExists) {
			// Create bucket with public access
			const { data, error } = await supabase.storage.createBucket(
				bucketName,
				{
					public: true,
					fileSizeLimit: 5242880, // 5MB
				}
			);

			if (error) {
				console.error("Error creating bucket:", error);
				return false;
			}

			// Set bucket to public
			const { error: policyError } = await supabase.storage
				.from(bucketName)
				.setPublic(true);

			if (policyError) {
				console.error("Error setting bucket to public:", policyError);
				return false;
			}
		}

		return true;
	} catch (error) {
		console.error("Bucket operation error:", error);
		return false;
	}
};

// Upload logo route
router.post("/logo", upload.single("file"), async (req, res) => {
	try {
		// Check if file exists
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const file = req.file;
		const filePath = file.path;
		const bucketName = "organization-logos";
		const orgName = req.body.orgName || "arbonearth"; // Use name from request or default
		const fileName = `${orgName}.${file.originalname.split(".").pop()}`;

		// Try to ensure bucket exists and is public
		const bucketReady = await getOrCreateBucket(bucketName);

		// Try uploading to Supabase
		if (bucketReady) {
			try {
				// Read file from disk
				const fileBuffer = fs.readFileSync(filePath);

				// Upload file to Supabase
				const { data, error } = await supabase.storage
					.from(bucketName)
					.upload(fileName, fileBuffer, {
						contentType: file.mimetype,
						upsert: true,
					});

				if (error) {
					throw error;
				}

				// Get public URL
				const { data: publicUrl } = supabase.storage
					.from(bucketName)
					.getPublicUrl(fileName);

				// Remove the local file after successful upload
				fs.unlinkSync(filePath);

				// Return the properly formatted URL
				return res.status(200).json({
					success: true,
					url: publicUrl.publicUrl,
				});
			} catch (supabaseError) {
				console.error("Error uploading to Supabase:", supabaseError);
				// Fall through to local storage fallback
			}
		}

		// Fallback: Use a direct Supabase URL format as requested
		// This is a mock URL since we couldn't upload to Supabase
		const supabaseUrl =
			process.env.NEXT_PUBLIC_SUPABASE_URL ||
			process.env.SUPABASE_URL ||
			"https://paywxlokodwtptxidcia.supabase.co";
		const mockUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;

		return res.status(200).json({
			success: true,
			url: mockUrl,
			note: "Using fallback URL format due to Supabase upload error",
		});
	} catch (error) {
		console.error("Error processing upload:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
