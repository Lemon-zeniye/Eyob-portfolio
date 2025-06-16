import { useRole } from "@/Context/RoleContext";
import GenerateQRCode from "./GeneratQRCode";
import ScanQRCode from "./ScanQRCode";

function HomePage() {
  const { role } = useRole();
  return <div>{role === "user" ? <GenerateQRCode /> : <ScanQRCode />}</div>;
}

export default HomePage;
