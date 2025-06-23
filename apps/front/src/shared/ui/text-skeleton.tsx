const SKELETON_ELEMENTS = {
  xs: (
    <div className="h-4 flex items-center">
      <div className="skeleton h-3 w-16" />
    </div>
  ),
  lg: (
    <div className="h-7 flex items-center">
      <div className="skeleton h-4.5 w-24" />
    </div>
  ),
};

interface TextSkeletonProps {
  size: "xs" | "lg";
}

export const TextSkeleton = ({ size }: TextSkeletonProps) => {
  return SKELETON_ELEMENTS[size];
};
