import { useRole } from "@/Context/RoleContext";
// import JobDetailNew from "./JobDetailNew";
import JobsDetailComapny from "./JobsDetailComapny";
import SampleJobDetailNew from "@/Pages/SampleJobDetail";

function JobDetailContainer() {
  const { role } = useRole();
  return (
    <div>
      {role === "user" ? <SampleJobDetailNew /> : <JobsDetailComapny />}
    </div>
  );
}

export default JobDetailContainer;
