declare module "react-qr-scanner" {
  import { ReactNode, Ref } from "react";

  interface QrScannerProps {
    onResult: (result: { text: string }) => void;
    onError: (error: Error) => void;
    constraints?: MediaTrackConstraints;
    containerStyle?: React.CSSProperties;
    videoStyle?: React.CSSProperties;
    scanDelay?: number;
    videoId?: string;
    className?: string;
    deviceId?: string;
    viewFinder?: ReactNode;
    hideViewFinder?: boolean;
    ref?: Ref<HTMLVideoElement>;
  }

  const QrScanner: React.ComponentType<QrScannerProps>;
  export default QrScanner;
}
