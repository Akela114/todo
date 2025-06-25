const SKELETON_ELEMENTS = {
  xs: {
    default: (
      <div className="h-4 flex items-center">
        <div className="skeleton h-3 w-16" />
      </div>
    ),
    square: (
      <div className="h-4 flex items-center">
        <div className="skeleton size-3" />
      </div>
    ),
  },
  lg: {
    default: (
      <div className="h-7 flex items-center">
        <div className="skeleton h-4.5 w-24" />
      </div>
    ),
  },
};

interface TextSkeletonProps<T extends keyof typeof SKELETON_ELEMENTS> {
  size: T;
  variant?: keyof (typeof SKELETON_ELEMENTS)[T];
}

export const TextSkeleton = <T extends keyof typeof SKELETON_ELEMENTS>({
  size,
  variant = "default",
}: TextSkeletonProps<T>) => {
  return SKELETON_ELEMENTS[size][variant];
};
