import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRole } from "@/Context/RoleContext";

const GenerateQRCode: React.FC = () => {
  const { user } = useRole();

  const qrRef = React.useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-lg text-gray-600">No user data available</p>
          <p className="text-sm text-gray-500">
            Please log in to generate QR code
          </p>
        </div>
      </div>
    );
  }

  const qrData = JSON.stringify({
    userId: user.id,
    username: user.username,
    ticketType: user.ticket_type,
    email: user.email,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center bg-white py-12 px-0 sm:px-6 lg:px-8">
      <div
        ref={qrRef}
        className="p-4 bg-white w-fit rounded-lg border border-gray-400 shadow-sm"
      >
        <QRCodeSVG
          value={qrData}
          size={200}
          level="H"
          includeMargin={true}
          fgColor="#1e40af"
          bgColor="#ffffff"
          imageSettings={{
            src: "https://cdn-icons-png.flaticon.com/512/236/236831.png",
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>
    </div>
  );
};

export default GenerateQRCode;
