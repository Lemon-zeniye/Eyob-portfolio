import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getActiveCompanies, referCompany } from "@/Api/profile.api";
import { Input } from "../ui/input";
import { tos } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/Api/axios";
import { Spinner } from "../ui/Spinner";

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

function ShareCompanyProfile({
  userId,
  onSuccess,
}: {
  userId: string | undefined;
  onSuccess: () => void;
}) {
  const { data: activeCompanies } = useQuery({
    queryKey: ["activeCompanies"],
    queryFn: getActiveCompanies,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: referCompany,
    onSuccess: () => {
      tos.success("Success");
      onSuccess();
    },
    onError: (error: any) => {
      const message = getAxiosErrorMessage(error);
      tos.error(message);
    },
  });

  const [selectedCompany, setselectedCompany] = useState<
    SelectedCompany | undefined
  >(undefined);
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
    setselectedCompany({ ...company, rating });
  };

  const handleSubmit = () => {
    console.log("Selected companies with ratings:", selectedCompany);
    if (selectedCompany && userId) {
      mutate({
        referredCandidate: userId,
        rating: selectedCompany.rating,
        company: selectedCompany?._id,
      });
    }
  };

  return (
    <div className="max-w-full bg-white rounded-lg">
      {selectedCompany?.rating === 0 && (
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
          const isSelected = company._id === selectedCompany?._id;

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
                          star <= (selectedCompany?.rating || 0) &&
                          selectedCompany?._id === company._id
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

      {selectedCompany && (
        <button
          onClick={handleSubmit}
          disabled={selectedCompany.rating === 0}
          className={`w-full py-2 flex items-center justify-center sticky bottom-0 px-4 rounded-md font-medium text-white ${
            selectedCompany.rating === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/70"
          }`}
        >
          {isLoading ? <Spinner /> : "Share"}
        </button>
      )}
    </div>
  );
}

export default ShareCompanyProfile;
