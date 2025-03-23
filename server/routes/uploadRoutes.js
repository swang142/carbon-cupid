import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { supabase } from "../config/database.js";

const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
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
		fileSize: 40 * 1024 * 1024, // 40 MB limit
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

// Upload logo route
router.post("/logo", upload.single("file"), async (req, res) => {
	try {
		// Check if file exists
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const file = req.file;
		const filePath = file.path;
		const fileName = file.filename;
		const bucketName = "organization-logos";

		// First try using Supabase for storage
		try {
			// Try to create bucket if it doesn't exist
			try {
				const { data: buckets } = await supabase.storage.listBuckets();
				const bucketExists = buckets?.find(
					(bucket) => bucket.name === bucketName
				);

				if (!bucketExists) {
					await supabase.storage.createBucket(bucketName, {
						public: true,
					});
				}
			} catch (bucketError) {
				console.log(
					"Bucket operation error (continuing):",
					bucketError
				);
				// Continue even if bucket creation fails
			}

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

			return res.status(200).json({
				success: true,
				url: publicUrl.publicUrl,
			});
		} catch (supabaseError) {
			console.error("Error uploading to Supabase:", supabaseError);

			// Fallback: Use local file storage instead
			// Create a URL to the file on the server
			const baseUrl =
				process.env.BASE_URL ||
				`http://localhost:${process.env.PORT || 8080}`;
			const fileUrl = `${baseUrl}/uploads/${fileName}`;

			return res.status(200).json({
				success: true,
				url: fileUrl,
				note: "Using local storage due to Supabase error",
			});
		}
	} catch (error) {
		console.error("Error processing upload:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
