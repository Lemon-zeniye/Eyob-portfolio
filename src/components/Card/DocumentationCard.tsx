import { Certificate } from "@/Types/profile.type";
import CertificateCard from "./CertificateCard";

function DocumentationCard({
  otherUserCertification,
}: {
  otherUserCertification: Certificate[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {otherUserCertification?.map((cert) => (
        <CertificateCard key={cert._id} certificate={cert} />
      ))}
    </div>
  );
}

export default DocumentationCard;
