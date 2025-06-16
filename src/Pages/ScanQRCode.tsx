import { useState, useCallback } from "react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

interface ScanResult {
  data: string;
  timestamp: Date;
}

const ScanQRCode = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const sendToBackend = useCallback(async (data: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual backend API call
      const response = await fetch("https://your-api-endpoint.com/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrData: data }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to backend");
      }

      const result = await response.json();
      setScanResult({ data, timestamp: new Date() });
      setCameraActive(false); // Turn off camera after successful scan
      console.log("Backend response:", result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error sending QR data to backend:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleScan = useCallback(
    (detectedCodes: IDetectedBarcode[]) => {
      if (detectedCodes.length > 0) {
        const firstCode = detectedCodes[0];
        console.log("Scanned data:", firstCode.rawValue);
        setScanResult({ data: "The ticket is Valid", timestamp: new Date() });

        // sendToBackend(firstCode.rawValue);
      }
    },
    [sendToBackend]
  );

  const handleError = useCallback((err: any) => {
    console.error("QR Scanner error:", err);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            QR Code Scanner
          </h1>
          <p className="text-gray-600 mb-6">Scan a QR code to process</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {scanResult ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="font-semibold text-green-800 mb-2">
                Scan Successful!
              </h2>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Data:</span> {scanResult.data}
              </p>
              <p className="text-sm text-gray-500">
                Scanned at: {scanResult.timestamp.toLocaleTimeString()}
              </p>
              <button
                onClick={resetScanner}
                className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Scan Another QR Code
              </button>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 aspect-square">
              {cameraActive ? (
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
                  sound="/success-beep.mp3" // Provide path to a sound file or false to disable
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
                    tracker: (detectedCodes, ctx) => {
                      // Custom tracking visualization
                      ctx.strokeStyle = "#FF3B30";
                      ctx.lineWidth = 4;
                      ctx.font = "14px Arial";
                      ctx.fillStyle = "#FF3B30";

                      detectedCodes.forEach((code) => {
                        // Draw bounding box around detected code
                        ctx.beginPath();
                        ctx.moveTo(
                          code.cornerPoints[0].x,
                          code.cornerPoints[0].y
                        );
                        code.cornerPoints.forEach((point, idx) => {
                          if (idx > 0) ctx.lineTo(point.x, point.y);
                        });
                        ctx.closePath();
                        ctx.stroke();

                        // Draw code format text
                        ctx.fillText(
                          code.format,
                          code.cornerPoints[0].x,
                          code.cornerPoints[0].y - 5
                        );
                      });
                    }, // Shows tracking UI for detected codes
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
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Camera is off</p>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Position the QR code within the frame to scan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQRCode;
