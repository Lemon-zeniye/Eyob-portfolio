import { useRole } from "@/Context/RoleContext";
import NewJobPage from "./NewJobPage";
import CompanyDashboard from "./CompanyDashboard";

function JobPage() {
  const { role } = useRole();
  return (
    <div>{role === "company" ? <CompanyDashboard /> : <NewJobPage />}</div>
  );
}

export default JobPage;
