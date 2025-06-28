import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRole } from "@/Context/RoleContext";
import logo from "../assets/logo.png";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import { MdArrowOutward } from "react-icons/md";
import { Label } from "@radix-ui/react-label";

const GenerateQRCode: React.FC = () => {
  const { user } = useRole();

  const qrRef = React.useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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
      <div className="w-full max-w-4xl space-y-8 text-center">
        {/* Main Content Container - Flex on desktop */}
        <div className="lg:flex lg:items-start lg:gap-12 lg:justify-center">
          {/* QR Code Section */}
          <div className="flex flex-col items-center lg:items-start lg:sticky lg:top-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 lg:text-3xl lg:mb-4">
              Your E-Ticket
            </h1>
            <div className="px-4 py-3 bg-white rounded-xl border  shadow-sm lg:p-8  my-2">
              <div className="grid grid-cols-1  gap-y-2 gap-x-4">
                <div className="flex items-center  gap-y-0 gap-x-2 sm:gap-2">
                  <Label className="block text-sm font-medium text-primary2/80 whitespace-nowrap">
                    Email
                  </Label>
                  <div className="text-gray-900 font-light text-left break-all">
                    {user.email}
                  </div>
                </div>

                <div className="flex items-center  gap-y-0 gap-x-2 sm:gap-2">
                  <Label className="block text-sm font-medium text-primary2/80 whitespace-nowrap">
                    No People
                  </Label>
                  <div className="text-gray-900 font-light">
                    {user.no_people}
                  </div>
                </div>

                <div className="flex items-center  gap-y-0 gap-x-2 sm:gap-2">
                  <Label className="block text-sm font-medium text-primary2/80 whitespace-nowrap">
                    Ticket Type
                  </Label>
                  <div className="text-gray-900 font-light">
                    <span className="inline-block px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm">
                      {user.ticket_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={qrRef}
              className="p-6 bg-white rounded-xl border border-gray-200 shadow-md lg:p-8"
            >
              <QRCodeSVG
                value={qrData}
                size={260}
                level="H"
                includeMargin={true}
                fgColor="#000000"
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

          {/* Right Column - Sponsor and Services */}
          <div className="lg:max-w-md lg:w-full">
            {/* Sponsor Section - Refined */}
            <div className="mt-12 space-y-4 lg:mt-0">
              <h2 className="text-lg font-medium tracking-wider underline lg:text-xl">
                Brought to you by
              </h2>

              <div
                className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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

            {/* Services Section */}
            <div className="mt-8 w-full flex flex-col items-center gap-y-4 lg:mt-12">
              <h2 className="text-lg font-medium tracking-wider underline lg:text-xl">
                Our Services
              </h2>
              <div className="grid grid-cols-1 gap-4 w-full lg:gap-6">
                {services.map((s, index) => (
                  <ServiceCard key={index} service={s} />
                ))}
              </div>
            </div>

            {/* Visit Button */}
            <button
              className="bg-primary2 text-white flex items-center justify-center gap-2 w-full text-lg py-3 rounded-xl hover:bg-primary2/70 mt-6 lg:mt-8 lg:text-xl lg:py-4"
              onClick={() => handleClick("https://www.akilocorp.com")}
            >
              Visit Akilo <MdArrowOutward className="text-xl" />
            </button>
          </div>
        </div>
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

const ServiceCard = ({ service }: { service: ServiceCardInterface }) => {
  return (
    <div className="group w-full h-[34vh] relative rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 sm:h-[40vh] lg:h-[30vh]">
      <img
        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
        src={service.img}
        alt={service.title}
      />

      <div className="absolute inset-x-0 bottom-2 px-2 py-2 bg-gray-900/50 rounded-lg border-2 border-gray-900/90 mx-2">
        <div className="flex items-end justify-between">
          <h2 className="text-xl text-left font-semibold text-white line-clamp-2 lg:text-lg xl:text-xl">
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

const handleClick = (link: string) => {
  window.open(link, "_blank");
};
