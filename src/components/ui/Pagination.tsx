import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = "",
}: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = Number(e.target.value);
    onItemsPerPageChange(newLimit);
    // Reset to first page when changing items per page
    onPageChange(1);
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5; // Maximum visible page numbers

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = maxVisible;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border rounded-md px-2 py-2 text-sm"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed opacity-50"
              : "bg-white border hover:bg-gray-50"
          }`}
          aria-label="First page"
        >
          «
        </button> */}

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed opacity-50"
              : "bg-white border hover:bg-gray-50"
          }`}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>

        {/* Show first page + ellipsis if needed */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`w-10 h-10 rounded-md ${
                currentPage === 1
                  ? "bg-primary text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              1
            </button>
            {visiblePages[0] > 2 && <span className="px-1">...</span>}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-md ${
              currentPage === page
                ? "bg-primary text-white"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Show last page + ellipsis if needed */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-1">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`w-10 h-10 rounded-md ${
                currentPage === totalPages
                  ? "bg-primary text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed opacity-50"
              : "bg-white border hover:bg-gray-50"
          }`}
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>

        {/* <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed opacity-50"
              : "bg-white border hover:bg-gray-50"
          }`}
          aria-label="Last page"
        >
          »
        </button> */}
      </div>
    </div>
  );
};

export default Pagination;
