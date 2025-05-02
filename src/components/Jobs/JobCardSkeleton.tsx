const JobCardSkeleton = () => {
  return (
    <div className="border bg-white border-gray-300 p-4">
      <div className="flex gap-4">
        {/* Logo Placeholder */}
        <div className="flex-none px-2">
          <div className="w-12 h-12 bg-gray-100 rounded" />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-4">
          {/* Job Title */}
          <div className="h-6 bg-gray-100 rounded w-3/4" />

          {/* Company & Location */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-4 bg-gray-100 rounded w-1" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Right Section: Button & Progress */}
        <div className="flex-none flex flex-col space-y-2 items-end">
          <div className="h-10 w-24 bg-gray-100 rounded" />
          <div className="w-24 h-1.5 bg-gray-100 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;
