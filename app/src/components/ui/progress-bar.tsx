'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FundingProgressBarProps {
  current: number
  requested: number
  className?: string
}

export const FundingProgressBar: React.FC<FundingProgressBarProps> = ({
  current,
  requested,
  className,
}) => {
    let rawProgress;
    if (requested === 0 && current === 0 || requested === 0 && current > 0) {
        rawProgress = 100;
    } else {
        rawProgress = (current / requested) * 100
    }
  const progress = Math.min(Math.max(rawProgress, 0), 100)

  const progressColor =
    progress >= 75
      ? 'bg-green-500'
      : progress >= 40
      ? 'bg-yellow-500'
      : 'bg-red-500'

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <span>Funding Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-500', progressColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
