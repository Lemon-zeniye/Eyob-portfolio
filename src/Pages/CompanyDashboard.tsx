import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobsOverview from "@/components/Jobs/JobsOverview";
import LatestJobs from "@/components/Jobs/LatestJobs";
import { useRole } from "@/Context/RoleContext";

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useRole();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button
          className={`flex items-center gap-2 ${
            mode === "formal"
              ? "bg-primary hover:bg-primary/60"
              : "bg-primary2 hover:bg-primary2/60"
          }`}
          onClick={() => navigate("/jobs/add-job")}
        >
          <PlusCircle className="h-4 w-4" />
          Post a job
        </Button>
      </div>

      <JobsOverview />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Latest jobs</h2>
          <Link to="/jobs" className="text-sm text-gray-500 hover:underline">
            See all
          </Link>
        </div>
        <LatestJobs />
      </div>
    </div>
  );
};

export default CompanyDashboard;
