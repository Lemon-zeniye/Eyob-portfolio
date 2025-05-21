// import { useState } from "react";
// import ExpAndEduCard from "./ExpAndEduCard";
// import AddExprience from "../Profile/AddExprience";
// import { useMutation, useQuery } from "react-query";
// import { getUserCV, getUserExperience, uploadCV } from "@/Api/profile.api";
// import { Button } from "../ui/button";
// import { motion, AnimatePresence } from "framer-motion";
// import * as Dialog from "@radix-ui/react-dialog";
// import { FileText, Plus, Upload, X } from "lucide-react";
// import { formatDateToMonthYear, tos } from "@/lib/utils";
// import { Spinner } from "../ui/Spinner";
// import { getAxiosSuccessMessage } from "@/Api/axios";

// const ExperienceCard = () => {
//   const [open, setOpen] = useState(false);
//   const [openUploadCV, setOpenUploadCV] = useState(false);
//   const [viewCV, setViewCV] = useState(false);

//   const [file, setFile] = useState<File | null>(null);

//   const handleFileChange = (e: any) => {
//     const selectedFile = e.target.files[0];
//     if (
//       selectedFile &&
//       [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ].includes(selectedFile.type)
//     ) {
//       setFile(selectedFile);
//     } else {
//       alert("Only PDF or Word documents are allowed.");
//       setFile(null);
//     }
//   };

//   const { mutate: upload, isLoading: uploading } = useMutation({
//     mutationFn: uploadCV,
//     onSuccess: () => {
//       setOpenUploadCV(false);
//       setFile(null);
//       tos.success("CV uploaded successfully");
//     },
//     onError: (error) => {
//       const mes = getAxiosSuccessMessage(error);
//       tos.error(mes);
//     },
//   });

//   const { data: userCV } = useQuery({
//     queryKey: ["userCV"],
//     queryFn: getUserCV,
//     onSuccess: () => {},
//   });

//   const { data: experiences } = useQuery({
//     queryKey: ["experiences"],
//     queryFn: getUserExperience,
//   });

//   const fileUrl = `/${userCV?.data?.path.replace("public/", "")}`;

//   const handleUpload = () => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("uploadCV", file);
//     upload(formData);
//   };

//   return (
//     <div className="flex flex-col gap-6 bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-sm">
//       <div className="flex flex-row gap-3 justify-end items-center">
//         <Button
//           variant="outline"
//           className="rounded-full border-2 border-[#4ecdc4] text-[#05A9A9] hover:bg-teal-50 hover:text-[#05A9A9] font-medium px-4 flex items-center gap-2 transition-all"
//           onClick={() => setOpenUploadCV(true)}
//         >
//           <Upload className="w-4 h-4" />
//           <span>Upload CV</span>
//         </Button>
//         <Button
//           variant="outline"
//           className="rounded-full border-2 border-[#4ecdc4] text-[#05A9A9] hover:bg-teal-50 hover:text-[#05A9A9] font-medium px-4 flex items-center gap-2 transition-all"
//           onClick={() => setViewCV(true)}
//         >
//           <FileText className="w-4 h-4" />
//           <span>View CV</span>
//         </Button>
//         <Button
//           className={`rounded-full px-5 font-medium flex items-center gap-2 transition-all ${
//             !open
//               ? "bg-gradient-to-r from-[#05A9A9] to-[#4ecdc4] hover:from-[#049494] hover:to-[#3dbdb5]"
//               : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
//           }`}
//           onClick={() => setOpen(!open)}
//         >
//           {open ? (
//             <>
//               <X className="w-4 h-4" />
//               <span>Cancel</span>
//             </>
//           ) : (
//             <>
//               <Plus className="w-4 h-4" />
//               <span>Add Experience</span>
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="relative">
//         <AnimatePresence mode="wait">
//           {!open ? (
//             <motion.div
//               key="education-list"
//               initial={{ x: 0, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "-100%", opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-6 px-2"
//             >
//               {experiences?.data?.length === 0 && (
//                 <div className="col-span-2 flex flex-col items-center justify-center py-10 text-center">
//                   <div className="bg-teal-100 p-4 rounded-full mb-4">
//                     <FileText className="w-8 h-8 text-[#05A9A9]" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-800 mb-2">
//                     No experience added yet
//                   </h3>
//                   <p className="text-gray-500 max-w-md">
//                     Add your professional experience to showcase your career
//                     journey
//                   </p>
//                 </div>
//               )}
//               {experiences &&
//                 experiences?.data.map((item, index) => (
//                   <ExpAndEduCard
//                     id={item._id}
//                     key={index}
//                     institution={item.entity}
//                     date={`${formatDateToMonthYear(
//                       item.startDate
//                     )} - ${formatDateToMonthYear(item.endDate)}`}
//                     location={item.location}
//                     title={item.jobTitle}
//                     isNotSkills
//                     type="Exp"
//                     locationType={item.locationType}
//                     onClick={() => {}}
//                   />
//                 ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="add-education"
//               initial={{ x: "100%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "100%", opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="bg-white rounded-xl p-6 shadow-sm"
//             >
//               <h1 className="text-xl py-2 font-semibold text-gray-800 border-b border-gray-100 mb-4">
//                 Add Experience
//               </h1>
//               <AddExprience onSuccess={() => setOpen(false)} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <Dialog.Root open={openUploadCV} onOpenChange={setOpenUploadCV}>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
//           <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-xl focus:outline-none border border-teal-100">
//             <div className="flex items-center justify-between mb-6">
//               <Dialog.Title className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <Upload className="w-5 h-5 text-[#05A9A9]" />
//                 Upload CV
//               </Dialog.Title>
//               <Dialog.Close asChild>
//                 <button className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
//                   <X className="w-4 h-4" />
//                 </button>
//               </Dialog.Close>
//             </div>

//             <div className="space-y-5">
//               <div className="border-2 border-dashed border-[#4ecdc4]/30 bg-teal-50 rounded-2xl p-6 text-center">
//                 <input
//                   type="file"
//                   id="cv-upload"
//                   accept=".pdf,.doc,.docx"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <label
//                   htmlFor="cv-upload"
//                   className="cursor-pointer flex flex-col items-center gap-2"
//                 >
//                   <div className="bg-white p-3 rounded-full shadow-sm mb-2">
//                     <Upload className="w-6 h-6 text-[#05A9A9]" />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">
//                     {file ? file?.name : "Click to select a file"}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     PDF or Word documents only
//                   </span>
//                 </label>
//               </div>

//               <Button
//                 onClick={handleUpload}
//                 disabled={!file || uploading}
//                 className="w-full rounded-full bg-gradient-to-r from-[#05A9A9] to-[#4ecdc4] hover:from-[#049494] hover:to-[#3dbdb5] py-6 font-medium"
//               >
//                 {uploading ? <Spinner /> : "Upload CV"}
//               </Button>
//             </div>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>

//       <Dialog.Root open={viewCV} onOpenChange={setViewCV}>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
//           <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-xl focus:outline-none border border-teal-100">
//             <div className="flex items-center justify-between mb-4">
//               <Dialog.Title className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-[#05A9A9]" />
//                 CV Preview
//               </Dialog.Title>
//               <Dialog.Close asChild>
//                 <button className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
//                   <X className="w-4 h-4" />
//                 </button>
//               </Dialog.Close>
//             </div>

//             <div className="h-full border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//               {userCV?.data?.path ? (
//                 <iframe
//                   src={`https://docs.google.com/gview?url=${encodeURIComponent(
//                     `https://awema.co/${fileUrl}`
//                   )}&embedded=true`}
//                   className="w-full h-[80vh]"
//                   frameBorder="0"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-50">
//                   <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
//                     <FileText className="w-8 h-8 text-purple-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-700 mb-2">
//                     No CV uploaded yet
//                   </h3>
//                   <p className="text-gray-500 max-w-md text-center">
//                     Upload your CV to view it here
//                   </p>
//                 </div>
//               )}
//             </div>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>
//     </div>
//   );
// };

// export default ExperienceCard;
