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
  <div className="bg-white rounded-xl shadow-lg p-6 flex items-start hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className={`${bgColor} p-3 rounded-lg mr-4 flex-shrink-0`}>
      <div className={`${iconColor} h-6 w-6`}>{icon}</div>
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  </div>
);

const JobsOverview: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["jobStatics"],
    queryFn: getJobStatics,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-0">
      <StatCard
        icon={<Briefcase className="h-full w-full" />}
        value={data?.data.pending}
        label="Jobs posted"
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        icon={<Users className="h-full w-full" />}
        value={data?.data.declined}
        label="Applicants"
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={<CheckCircle className="h-full w-full" />}
        value={data?.data.accepted}
        label="Hired"
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
    </div>
  );
};

export default JobsOverview;
