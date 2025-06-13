import { useRole } from "@/Context/RoleContext";
import NewJobPage from "./NewJobPage";
import CompanyDashboard from "./CompanyDashboard";
import SampleJob from "./SampleJob";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function JobPage() {
  const { role } = useRole();

  if (role === "company") {
    return <CompanyDashboard />;
  }

  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Internal Jobs ", "External Jobs"];
  const tabContent = [
    <NewJobPage key="internal" />,
    <SampleJob key="external" />,
  ];

  return (
    <div className="">
      {/* Tabs Header */}
      <div className="flex justify-center  space-x-4 mb-2">
        {tabs.map((label, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`text-xs rounded-full transition duration-300 ${
              activeTab === index
                ? " text-gray-700 underline underline-offset-8"
                : " text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default JobPage;
