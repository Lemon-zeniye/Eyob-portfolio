import { useState, useCallback } from "react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useMutation } from "react-query";
// import { getAxiosErrorMessage } from "@/Api/axios";
// import { tos } from "@/lib/utils";
import { scan } from "@/Api/scan";
import scanSound from "../assets/store-scanner-beep-90395.mp3";
import logo from "../assets/logo.png";
import { MdArrowOutward } from "react-icons/md";
import checkSvg from "../assets/check.svg";
import errorSvg from "../assets/error.svg";
import { tos } from "@/lib/utils";

interface ScanResult {
  data: string;
  timestamp: Date;
}

const ScanQRCode = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [cameraActive, setCameraActive] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { mutate: sendToBackend, isLoading } = useMutation({
    mutationFn: scan,
    onSuccess: (res) => {
      setScanResult({ data: res?.ticket_type, timestamp: new Date() });
      setCameraActive(false);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message;
      setError(msg || error.message || "An unknown error occurred");
      setCameraActive(false);
    },
  });

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    try {
      if (detectedCodes.length > 0) {
        const firstCode = detectedCodes[0];
        const parsedData = JSON.parse(firstCode.rawValue);

        if (!parsedData.userId) {
          tos.error("QR code doesn't contain userId");
          return;
        }

        sendToBackend({ id: parsedData.userId });
      }
    } catch (error) {
      setError("Unknown QR code");
      setCameraActive(false);
    }
  };
  const handleError = useCallback((err: any) => {
    if (err.name === "NotAllowedError") {
      setError(
        "Camera permission was denied. Please allow camera access to scan QR codes."
      );
      setHasPermission(false);
    } else if (err.name === "NotFoundError") {
      setError("No camera found on this device.");
    } else {
      setError(err.message);
    }
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setCameraActive(true);
  };

  const requestCameraPermission = () => {
    // This will trigger the browser's permission dialog when the scanner tries to access the camera
    setError(null);
    setCameraActive(true);
    setHasPermission(null);
  };

  const handleClick = () => {
    window.open("https://www.akilocorp.com/", "_blank");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-2 mb-12 space-y-4">
      <h1 className="text-lg text-center font-bold text-gray-800 mb-2">
        Scan Ticket
      </h1>
      <p className="text-center  mb-4">Aim Your Camera at the QR-Code</p>
      <div className="w-full max-w-md md:max-w-full  bg-white rounded-xl overflow-hidden">
        <div className="flex items-center flex-col justify-center w-full">
          {error && (
            <div className="mb-4 p-4 border px-14 shadow-lg text-red-700 rounded-xl flex items-center justify-center flex-col">
              <img src={errorSvg} alt="error" className="w-44 h-44" />
              <p>{error}</p>
              {hasPermission === false ? (
                <button
                  onClick={requestCameraPermission}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Grant Camera Permission
                </button>
              ) : (
                <button
                  onClick={resetScanner}
                  className="mt-4 py-2 px-10 bg-primary2 hover:bg-primary2/70 text-white font-medium rounded-full transition-colors"
                >
                  Scan Another
                </button>
              )}
            </div>
          )}

          {scanResult ? (
            <div className="mb-6  p-4 px-14 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center flex-col">
              <img src={checkSvg} alt="error" className="w-44 h-44" />

              <h2 className="font-semibold text-xl text-green-800 mb-2">
                Ticket Recognized!
              </h2>
              <div className="text-gray-700 mb-2">
                <p className="font-medium text-lg">Ticket Type</p>
                <p> {scanResult.data}</p>
              </div>
              <button
                onClick={resetScanner}
                className="mt-4  py-2 px-10 bg-primary2 hover:bg-primary2/70 text-white font-medium rounded-full transition-colors"
              >
                Scan Another
              </button>
            </div>
          ) : (
            <div className="">
              {cameraActive && (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 aspect-square max-w-[300px]">
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                      facingMode: "environment",
                      aspectRatio: 1,
                    }}
                    formats={["qr_code"]}
                    paused={false}
                    scanDelay={500}
                    allowMultiple={false}
                    sound={scanSound}
                    styles={{
                      container: {
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      },
                      video: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                    components={{
                      onOff: true, // Shows camera on/off toggle
                      torch: true, // Shows torch/flashlight toggle (if available)
                      zoom: false, // Disables zoom controls (usually not needed for QR)
                      finder: true, // Shows finder/viewfinder overlay
                    }}
                  >
                    {/* Custom overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-4 border-white rounded-lg w-3/4 h-3/4 opacity-75"></div>
                    </div>
                  </Scanner>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary2"></div>
            </div>
          )}
        </div>
      </div>

      {/* Sponsor Section - Refined */}
      <div className="mt-12 space-y-4 max-w-md mx-auto">
        <h2 className="text-lg text-center font-medium tracking-wider underline">
          Brought to you by
        </h2>

        <div
          className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          onClick={handleClick}
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

      {/* visit button */}
      <button
        className="bg-primary2 text-white flex items-center justify-center gap-2 w-full text-lg py-3 rounded-xl hover:bg-primary2/70 max-w-md mx-auto"
        onClick={handleClick}
      >
        Visit Akilo <MdArrowOutward className="text-xl" />
      </button>
    </div>
  );
};

export default ScanQRCode;
