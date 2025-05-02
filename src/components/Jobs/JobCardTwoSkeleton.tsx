const JobCardTwoSkeleton = () => {
  return (
    <div className="border p-4 w-100 shadow-sm bg-white">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-gray-100 rounded-full" />
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>

      {/* Title */}
      <div className="h-5 w-3/4 bg-gray-100 rounded mt-4" />

      {/* Company & Location */}
      <div className="h-4 w-1/2 bg-gray-100 rounded mt-2" />

      {/* Tags */}
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
        <div className="h-6 w-24 bg-gray-100 rounded-full" />
      </div>

      {/* Progress */}
      <div className="mt-5 space-y-2">
        <div className="w-full bg-gray-100 h-1.5 rounded">
          <div className="bg-gray-300 h-1.5 w-1/2 rounded" />
        </div>
        <div className="h-4 w-40 bg-gray-100 rounded" />
      </div>
    </div>
  );
};

export default JobCardTwoSkeleton;
