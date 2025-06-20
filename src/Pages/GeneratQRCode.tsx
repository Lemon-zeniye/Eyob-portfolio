import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRole } from "@/Context/RoleContext";
import logo from "../assets/logo.png";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import { MdArrowOutward } from "react-icons/md";

const GenerateQRCode: React.FC = () => {
  const { user } = useRole();

  const qrRef = React.useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)]  bg-gradient-to-br bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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

  const services: ServiceCardInterface[] = [
    {
      img: img1,
      title: "Social Media Management",
      link: "https://www.instagram.com/waelatigray/",
    },
    {
      img: img2,
      title: "Web Development",
      link: "https://www.akilocorp.com/portfolio",
    },
    {
      img: img3,
      title: "AI Powered Applications",
      link: "https://www.akilocorp.com/portfolio",
    },
  ];

  const handleClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-2 sm:px-6 lg:px-8 mb-10">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* QR Code Section */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your E-Ticket
          </h1>
          <div
            ref={qrRef}
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-md"
          >
            <QRCodeSVG
              value={qrData}
              size={260}
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

        {/* Sponsor Section - Refined */}
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-medium tracking-wider underline">
            Brought to you by
          </h2>

          <div
            className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            onClick={() => handleClick("https://www.akilocorp.com/")}
          >
            <div className="flex items-center justify-between gap-2">
              <img
                src={logo}
                alt="Akilo Consultancy Corporation"
                className="w-24 h-24 object-cover shrink-0"
              />
              <div className="text-left flex-1">
                <p className="text-2xl font-bold text-gray-900 leading-tight">
                  Akilo Consultancy
                </p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">
                  Corporation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* services */}
        <div className="mt-2 w-full flex flex-col items-center gap-y-4">
          <h2 className="text-lg font-medium tracking-wider underline">
            Our Services
          </h2>
          <div className="flex flex-col gap-y-4 items-center justify-center gap-10  w-full">
            {services.map((s) => (
              <ServiceCard service={s} />
            ))}
          </div>
        </div>

        {/* visit button */}
        <button
          className="bg-primary2 text-white flex items-center justify-center gap-2 w-full text-lg py-3 rounded-xl hover:bg-primary2/70"
          onClick={() => handleClick("https://www.akilocorp.com")}
        >
          Visit Akilo <MdArrowOutward className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default GenerateQRCode;

interface ServiceCardInterface {
  img: string; // path to asset
  title: string;
  link: string;
}

const handleClick = (link: string) => {
  window.open(link, "_blank");
};

const ServiceCard = ({ service }: { service: ServiceCardInterface }) => {
  return (
    <div className="group w-full h-[34vh] relative rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
        src={service.img}
        alt={service.title}
      />

      <div className="absolute inset-x-0 bottom-2 px-2 py-2  bg-gray-900/50  rounded-lg border-2 border-gray-900/90 mx-2">
        <div className="flex items-end justify-between">
          <h2 className="text-xl text-left font-semibold text-white line-clamp-2">
            {service.title}
          </h2>
          <button
            className="px-3 py-1.5 rounded-lg bg-primary2 text-white text-sm font-medium hover:bg-primary2/90 transition-colors whitespace-nowrap"
            onClick={() => handleClick(service.link)}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};
