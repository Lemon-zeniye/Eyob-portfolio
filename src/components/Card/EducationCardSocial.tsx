import { useState } from "react"
import ExpAndEduCard from "./ExpAndEduCard"
import AddEducation from "../Profile/AddEducation"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "react-query"
import { getEducations } from "@/Api/profile.api"
import { Button } from "../ui/button"
import AddCertification from "../Profile/AddCertification"
import { GraduationCap, Plus, Award, X } from "lucide-react"

const EducationCard = () => {
  const [open, setOpen] = useState(false)
  const [certification, setCertification] = useState(false)

  const { data: educations } = useQuery({
    queryKey: ["educations"],
    queryFn: getEducations,
  })

  return (
    <div className="flex flex-col gap-6 bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-sm">
      <div className="flex flex-row gap-3 justify-end items-center">
        {!open && !certification && (
          <>
            <Button
              variant="outline"
              className="rounded-full border-2 border-[#4ecdc4] text-[#05A9A9] hover:bg-teal-50 hover:text-[#05A9A9] font-medium px-4 flex items-center gap-2 transition-all"
              onClick={() => {
                setCertification(true)
              }}
            >
              <Award className="w-4 h-4" />
              <span>Certification</span>
            </Button>
            <Button
              className="rounded-full px-5 font-medium flex items-center gap-2 transition-all bg-gradient-to-r from-[#05A9A9] to-[#4ecdc4] hover:from-[#049494] hover:to-[#3dbdb5]"
              onClick={() => {
                setOpen(true)
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </Button>
          </>
        )}

        {(open || certification) && (
          <Button
            className="rounded-full px-5 font-medium flex items-center gap-2 transition-all bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            onClick={() => {
              setOpen(false)
              setCertification(false)
            }}
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
        )}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {!open && !certification ? (
            <motion.div
              key="education-list"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-6 px-2"
            >
              {educations?.data?.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-teal-100 p-4 rounded-full mb-4">
                    <GraduationCap className="w-8 h-8 text-[#05A9A9]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No education added yet
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Add your educational background to showcase your academic
                    achievements
                  </p>
                </div>
              )}
              {educations &&
                educations?.data.map((item, index) => (
                  <ExpAndEduCard
                    id={item._id}
                    key={index}
                    institution={item.institution}
                    date={`${item.graduationYear}`}
                    location={""}
                    type="Edu"
                    title={item.degree}
                    gpa={item.gpa}
                    isNotSkills
                    onClick={() => {}}
                  />
                ))}
            </motion.div>
          ) : (
            <motion.div
              key="add-education"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h1 className="text-xl py-2 font-semibold text-gray-800 border-b border-gray-100 mb-4 flex items-center gap-2">
                {open ? (
                  <>
                    <GraduationCap className="w-5 h-5 text-[#05A9A9]" />
                    Add Education
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5 text-[#05A9A9]" />
                    Add Certification
                  </>
                )}
              </h1>

              {open && <AddEducation onSuccess={() => setOpen(false)} />}
              {certification && (
                <AddCertification onSuccess={() => setCertification(false)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EducationCard
