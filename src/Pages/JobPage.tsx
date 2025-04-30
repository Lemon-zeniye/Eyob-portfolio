import { useRole } from "@/Context/RoleContext";
import CompanyJob from "./CompanyJob";
import Jobs from "./Jobs";

function JobPage() {
  const { role } = useRole();
  return <div>{role === "company" ? <CompanyJob /> : <Jobs />}</div>;
}

export default JobPage;
