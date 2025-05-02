import { useRole } from "@/Context/RoleContext";
import CompanyJob from "./CompanyJob";
import NewJobPage from "./NewJobPage";

function JobPage() {
  const { role } = useRole();
  return <div>{role === "company" ? <CompanyJob /> : <NewJobPage />}</div>;
}

export default JobPage;
