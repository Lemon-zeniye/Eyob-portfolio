// import html2canvas from "html2canvas";
// import { useCallback } from "react";

// export const useDownloadQRCode = () => {
//   const downloadQRCode = useCallback(
//     (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => {
//       if (!elementRef.current) return;

//       html2canvas(elementRef.current).then((canvas) => {
//         const link = document.createElement("a");
//         link.download = `${fileName}.png`;
//         link.href = canvas.toDataURL("image/png");
//         link.click();
//       });
//     },
//     []
//   );

//   return { downloadQRCode };
// };
