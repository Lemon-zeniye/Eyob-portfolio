import { getJobStatics } from "@/Api/job.api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "react-query";
import { GoStar } from "react-icons/go";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoPeopleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function CompanyJob() {
  const { data } = useQuery({
    queryKey: ["jobStatics"],
    queryFn: getJobStatics,
  });

  const navigate = useNavigate();

  // const { data: jobs } = useQuery({
  //   queryKey: ["comapnyJobs"],
  //   queryFn: getCompanyJobs,
  // });

  const stats = [
    {
      label: "Pending",
      value: data?.pending || 0,
      color: "text-yellow-500",
      icon: <GoStar />,
    },
    {
      label: "Accepted",
      value: data?.accepted || 0,
      color: "text-green-500",
      icon: <HiOutlineBriefcase />,
    },
    {
      label: "Declined",
      value: data?.declined || 0,
      color: "text-red-500",
      icon: <IoPeopleOutline />,
    },
  ];

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3">
        <div className="col-span-1">
          <Button
            className="rounded-none mb-4"
            onClick={() => navigate("/jobs/add-job")}
          >
            Add Job
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 w-full">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-md border border-gray-200">
              <CardHeader className="flex items-center  text-lg font-semibold">
                <span className={`${stat.color} text-3xl`}>{stat.icon}</span>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-center ">
                {stat.value}
              </CardContent>
              <CardFooter className="text-center text-lg text-gray-500 justify-center">
                Total {stat.label.toLowerCase()} jobs
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyJob;
