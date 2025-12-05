import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height,
  borderRadius
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;
  if (borderRadius) style.borderRadius = borderRadius;

  return (
    <div 
      className={`skeleton ${className}`} 
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
};

export default Skeleton;
