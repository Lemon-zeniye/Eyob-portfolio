import { FC, useState } from "react";

interface TabsProps {
  children: React.ReactNode[];
  tabs: string[];
  onTabChange?: (index: number, tab?: string) => void;
  variant?: "default" | "filled";
  classname?: string;
  tabClassName?: string;
}
const activeTabClass = (variant: TabsProps["variant"]) => {
  if (variant === "filled") return "bg-primary text-white py-1 px-4 ";

  return "inline-block p-3 text-primary rounded-t-lg border-b-2 border-primary active ";
};

const tabClass = (variant: TabsProps["variant"]) => {
  if (variant === "filled") return "bg-primary text-white py-1 px-4";

  return "inline-block p-3 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 ";
};

const Tabs: FC<TabsProps> = ({
  onTabChange,
  tabs,
  children,
  variant = "default",
  classname,
  tabClassName,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (tab: string, index: number) => {
    setActiveTab(index);
    onTabChange?.(index, tab);
  };

  return (
    <div className={`flex flex-col w-full gap-4  ${classname} `}>
      <div
        className={`text-sm font-medium text-center text-gray-500 ${
          variant === "default" && "border-b"
        } border-gray-200 ${tabClassName}`}
      >
        <ul className="flex flex-wrap  ">
          {tabs.map((tab, index) => (
            <li
              onClick={() => handleTabChange(tab, index)}
              key={`tab-index-${index}`}
              className={`${variant === "default" && "mr-2"} cursor-pointer  `}
            >
              <div
                className={
                  activeTab === index
                    ? activeTabClass(variant)
                    : tabClass(variant) + `sm:text-base sm-phone:text-xs`
                }
              >
                {tab}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {children[activeTab]}
    </div>
  );
};

export default Tabs;
