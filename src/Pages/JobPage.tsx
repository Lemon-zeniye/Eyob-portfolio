import { useRole } from "@/Context/RoleContext";
// import NewJobPage from "./NewJobPage";
import CompanyDashboard from "./CompanyDashboard";
import SampleJob from "./SampleJob";

function JobPage() {
  const { role } = useRole();
  return <div>{role === "company" ? <CompanyDashboard /> : <SampleJob />}</div>;
}

export default JobPage;
