import React from "react";
import { QRCodeSVG } from "qrcode.react"; // Changed import
// import { useDownloadQRCode } from "../hooks/useDownloadQRCode";

interface UserData {
  id: string;
  username: string;
  ticket_type: string;
  email: string;
  role: string;
  no_people: number;
  is_active: boolean;
}

const GenerateQRCode: React.FC = () => {
  const user: UserData = {
    id: "684ec051d418628cf64503be",
    username: "w5myccv7",
    ticket_type: "Single Day Access",
    email: "hagosamanuel80@gmail.com",
    role: "user",
    no_people: 1,
    is_active: true,
  };

  const qrRef = React.useRef<HTMLDivElement>(null);
  //   const { downloadQRCode } = useDownloadQRCode();

  const qrData = JSON.stringify({
    userId: user.id,
    username: user.username,
    ticketType: user.ticket_type,
    email: user.email,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Rest of your component remains the same */}
      <div
        ref={qrRef}
        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <QRCodeSVG // Changed component name
          value={qrData}
          size={200}
          level="H"
          includeMargin={true}
          fgColor="#1e40af"
          bgColor="#ffffff"
          imageSettings={{
            src: "https://cdn-icons-png.flaticon.com/512/217/217853.png",
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>
      {/* Rest of your component remains the same */}
    </div>
  );
};

export default GenerateQRCode;
