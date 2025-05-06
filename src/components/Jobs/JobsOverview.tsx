import type React from "react";
import { Briefcase, Users, CheckCircle } from "lucide-react";
import { useQuery } from "react-query";
import { getJobStatics } from "@/Api/job.api";

interface StatCardProps {
  icon: React.ReactNode;
  value: number | undefined;
  label: string;
  bgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  bgColor,
  iconColor,
}) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center">
    <div className={`${bgColor} p-3 rounded-full mr-4`}>
      <div className={iconColor}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-bold">{value ?? 0}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const JobsOverview: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["jobStatics"],
    queryFn: getJobStatics,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={<Briefcase className="h-6 w-6" />}
        value={data?.data.pending}
        label="Jobs posted"
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        icon={<Users className="h-6 w-6" />}
        value={data?.data.declined}
        label="Applicants"
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={<CheckCircle className="h-6 w-6" />}
        value={data?.data.accepted}
        label="Hired"
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
    </div>
  );
};

export default JobsOverview;
