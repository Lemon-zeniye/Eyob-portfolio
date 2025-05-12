import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getActiveCompanies } from "@/Api/profile.api";
import { Input } from "../ui/input";

export interface ActiveCompany {
  email: string;
  name: string;
  picturePath: string;
  role: string;
  _id: string;
}

interface SelectedCompany extends ActiveCompany {
  rating: number;
}

function ShareCompanyProfile() {
  const { data: activeCompanies } = useQuery({
    queryKey: ["activeCompanies"],
    queryFn: getActiveCompanies,
  });

  const [selectedCompanies, setSelectedCompanies] = useState<SelectedCompany[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const filteredCompanies = useMemo(() => {
    if (!activeCompanies?.data) return [];
    return activeCompanies.data.filter((company) =>
      company.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [activeCompanies?.data, debouncedSearch]);

  const handleRatingChange = (company: ActiveCompany, rating: number) => {
    setSelectedCompanies((prev) => {
      const existingIndex = prev.findIndex((c) => c._id === company._id);

      if (existingIndex >= 0) {
        // Update rating if already selected
        return prev.map((c) => (c._id === company._id ? { ...c, rating } : c));
      } else {
        // Add company with rating if not selected
        return [...prev, { ...company, rating }];
      }
    });
  };

  const handleSubmit = () => {
    console.log("Selected companies with ratings:", selectedCompanies);
    // Add your submission logic here
  };

  return (
    <div className="max-w-full bg-white rounded-lg">
      {selectedCompanies.some((c) => c.rating === 0) && (
        <p className="mt-1 sticky top-0 bg-white text-xs text-center text-red-500">
          * Please provide ratings for all selected companies
        </p>
      )}

      <div className="space-y-3 mb-6">
        <div className="px-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Companies..."
            className="w-full"
          />
        </div>
        {filteredCompanies.map((company: ActiveCompany) => {
          const selectedCompany = selectedCompanies.find(
            (c) => c._id === company._id
          );
          const isSelected = !!selectedCompany;

          return (
            <div
              key={company._id}
              className={`border rounded-lg p-3 transition-all duration-200 h-28 flex flex-col ${
                isSelected
                  ? "border-primary bg-blue/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between flex-grow">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src="https://i.pravatar.cc/100?img=9"
                      alt={company.name}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {company.name}
                    </p>
                    <p className="text-xs text-gray-500">{company.email}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-primary">
                    Selected
                  </span>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-700">
                    Rate and Share this company:
                  </p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(company, star)}
                        className={`text-xl ${
                          star <= (selectedCompany?.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-medium text-gray-600">
                      {selectedCompany?.rating || 0}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCompanies.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={selectedCompanies.some((c) => c.rating === 0)}
          className={`w-full py-2 sticky bottom-0 px-4 rounded-md font-medium text-white ${
            selectedCompanies.some((c) => c.rating === 0)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/70"
          }`}
        >
          Share Selected ({selectedCompanies.length})
        </button>
      )}
    </div>
  );
}

export default ShareCompanyProfile;
