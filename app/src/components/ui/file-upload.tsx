import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileUploadProps {
	onFileChange: (file: File | null) => void;
	value?: string | null;
	className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
	onFileChange,
	value,
	className,
}) => {
	const [preview, setPreview] = useState<string | null>(value || null);
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (file) {
			// Create a preview URL
			const previewUrl = URL.createObjectURL(file);
			setPreview(previewUrl);
			onFileChange(file);
		} else {
			setPreview(null);
			onFileChange(null);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0] || null;
		if (file) {
			// Check if it's an image
			if (!file.type.startsWith("image/")) {
				alert("Please upload an image file");
				return;
			}

			// Create a preview URL
			const previewUrl = URL.createObjectURL(file);
			setPreview(previewUrl);
			onFileChange(file);

			// Update the input value programmatically
			if (inputRef.current) {
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(file);
				inputRef.current.files = dataTransfer.files;
			}
		}
	};

	const handleRemoveImage = () => {
		setPreview(null);
		onFileChange(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const handleButtonClick = () => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

	return (
		<div
			className={cn(
				"relative rounded-md border-2 border-dashed p-4 transition-all",
				isDragging
					? "border-primary bg-primary/5"
					: "border-gray-300 hover:border-primary/50",
				className
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<Input
				type="file"
				ref={inputRef}
				onChange={handleFileChange}
				accept="image/*"
				className="hidden"
			/>

			{preview ? (
				<div className="flex flex-col items-center">
					<div className="relative w-40 h-40 mx-auto mb-2">
						<Image
							src={preview}
							alt="Preview"
							fill
							style={{ objectFit: "contain" }}
							className="rounded-md"
						/>
						<button
							type="button"
							onClick={handleRemoveImage}
							className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
						>
							<XIcon size={16} />
						</button>
					</div>
					<span className="text-sm text-muted-foreground">
						Click to change logo
					</span>
				</div>
			) : (
				<div
					className="flex flex-col items-center justify-center py-4 cursor-pointer"
					onClick={handleButtonClick}
				>
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
						<ImageIcon size={32} className="text-gray-400" />
					</div>
					<p className="text-sm font-medium">
						Drag & drop or click to upload
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						Supports PNG, JPG or GIF (max 2MB)
					</p>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
