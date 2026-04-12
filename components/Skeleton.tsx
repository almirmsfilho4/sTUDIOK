'use client';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({ className = '', width = '100%', height = '1rem', rounded = 'md' }: SkeletonProps) {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }[rounded];

  return (
    <div 
      className={`animate-pulse bg-[#1A1A1A] ${roundedClass} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton width="3rem" height="3rem" rounded="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="1.25rem" />
          <Skeleton width="40%" height="1rem" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      <div className="space-y-4">
        <Skeleton width="40%" height="1.5rem" />
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton width="70%" height="1.25rem" />
          <Skeleton width="40%" height="1rem" />
        </div>
        <Skeleton width="5rem" height="1.5rem" rounded="full" />
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <Skeleton width="4rem" height="1rem" />
          <Skeleton width="3rem" height="1rem" />
        </div>
        <Skeleton width="100%" height="0.5rem" rounded="full" />
      </div>
    </div>
  );
}