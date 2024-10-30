// src/app/components/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  count: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ count }) => {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-300 h-64 rounded-md"
        ></div>
      ))}
    </div>
  );
};

export default Skeleton;
