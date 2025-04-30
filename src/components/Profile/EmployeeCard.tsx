import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddEmployee from "./AddEmployee";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import EmptyCard from "../Card/EmptyCard";
import user from "../../assets/user.jpg";
import { useQuery } from "react-query";
import { getCompanyEmployees } from "@/Api/profile.api";
function EmployeeCard() {
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: getCompanyEmployees,
  });

  return (
    <div>
      <div className="flex flex-row gap-2 justify-end items-end my-2">
        <Button
          className={`${
            !open
              ? "bg-primary hover:bg-primary/80"
              : "bg-red-500 hover:bg-red-500/80"
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? "Cancel" : "Add"}
        </Button>
      </div>
      <div className="">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="education-list"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="grid sm-phone:grid-cols-1 lg:grid-cols-2 sm-phone:gap-8 lg:gap-10 px-2"
            >
              {employees?.data.map((employee) => (
                <EmptyCard
                  onClick={() => console.log("e")}
                  cardClassname="relative px-5"
                  contentClassname="flex flex-row gap-5 py-4"
                  key={employee._id}
                >
                  <div
                    className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 md:h-28 md:w-28  rounded-full flex items-center justify-center border-2 text-primary border-primary 
             "
                  >
                    <img
                      src={user}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 justify-center ">
                    <div>
                      <p className="text-lg font-semibold">{employee.name}</p>
                      <p className="text-base font-normal opacity-50">
                        {employee.empPosition}
                      </p>
                    </div>
                    {/* 3-dot menu */}
                    <div
                      className="absolute top-3 right-4 group z-10"
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={() => setShowMenu(employee._id)}
                      onMouseLeave={() => setShowMenu(null)}
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />

                      {showMenu === employee._id && (
                        <div className="absolute right-0 mt-0 bg-white shadow-md rounded-md border text-sm z-20">
                          <button
                            className="px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                            onClick={() => {}}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </EmptyCard>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="add-education"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut" }}
            >
              <h1 className="text-lg py-2 items-center font-semibold">
                Add Experience
              </h1>
              <AddEmployee onSuccess={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default EmployeeCard;
