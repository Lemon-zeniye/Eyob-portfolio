import { useRole } from "@/Context/RoleContext";
import JobDetailNew from "./JobDetailNew";
import JobsDetailComapny from "./JobsDetailComapny";

function JobDetailContainer() {
  const { role } = useRole();
  return (
    <div>{role === "user" ? <JobDetailNew /> : <JobsDetailComapny />}</div>
  );
}

export default JobDetailContainer;
