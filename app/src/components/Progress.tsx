// components/ui/progress.tsx
import React from "react";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, className }) => {
  const progress = Math.min(Math.max(0, value), max); // Ensure the value is within bounds (0 to max)

  return (
    <div className={`relative w-full h-2 bg-gray-200 rounded-full ${className}`}>
      <div
        className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
        style={{ width: `${(progress / max) * 100}%` }}
      />
    </div>
  );
};
