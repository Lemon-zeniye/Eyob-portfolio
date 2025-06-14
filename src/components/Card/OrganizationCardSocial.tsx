// import { useState } from "react"
// import ExpAndEduCard from "./ExpAndEduCard"
// import { useQuery } from "react-query"
// import { getUserOrganization } from "@/Api/profile.api"
// import { Button } from "../ui/button"
// import { motion, AnimatePresence } from "framer-motion"
// import AddOrganization from "../Profile/AddOrganization"
// import { Building, Plus, X } from "lucide-react"

// const OrganizationCard = () => {
//   const [open, setOpen] = useState(false)
//   const { data: organizations } = useQuery({
//     queryKey: ["organization"],
//     queryFn: getUserOrganization,
//   })

//   return (
//     <div className="flex flex-col gap-6 bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-sm">
//       <div className="flex flex-row gap-3 justify-end items-center">
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
//               <span>Add Organization</span>
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="relative">
//         <AnimatePresence mode="wait">
//           {!open ? (
//             <motion.div
//               key="organization-list"
//               initial={{ x: 0, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "-100%", opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 px-2"
//             >
//               {organizations?.data?.length === 0 && (
//                 <div className="col-span-2 flex flex-col items-center justify-center py-10 text-center">
//                   <div className="bg-teal-100 p-4 rounded-full mb-4">
//                     <Building className="w-8 h-8 text-[#05A9A9]" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-800 mb-2">
//                     No organizations added yet
//                   </h3>
//                   <p className="text-gray-500 max-w-md">
//                     Add organizations you're affiliated with to enhance your
//                     professional profile
//                   </p>
//                 </div>
//               )}
//               {organizations &&
//                 organizations?.data.map((item, index) => (
//                   <ExpAndEduCard
//                     id={item._id}
//                     key={index}
//                     isNotSkills={false}
//                     title={item.organizationName}
//                     type="Org"
//                     category={item.organizationType}
//                     orgEmail={item.email}
//                   />
//                 ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="add-organization"
//               initial={{ x: "100%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "100%", opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="bg-white rounded-xl p-6 shadow-sm"
//             >
//               <h1 className="text-xl py-2 font-semibold text-gray-800 border-b border-gray-100 mb-4 flex items-center gap-2">
//                 <Building className="w-5 h-5 text-[#05A9A9]" />
//                 Add Organization
//               </h1>
//               <AddOrganization onSuccess={() => setOpen(false)} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// export default OrganizationCard
