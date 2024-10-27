import { Route } from "@/Pages/Main/Sidebar"
import { Briefcase, Home, MessageCircle, Settings } from "lucide-react"
import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

interface SidebarSmProps {
  handleSelected: (id: number, name: string) => void
  selected: number | null
}

const routes: Route[] = [
  {
    id: 1,
    icon: Home,
    name: "Feed",
    path: "/",
  },
  {
    id: 2,
    icon: MessageCircle,
    name: "Chat",
    path: "",
  },
  {
    id: 3,
    icon: Briefcase,
    name: "Jobs",
    path: "/jobs",
  },
  {
    id: 4,
    icon: Settings,
    name: "Settings",
    path: "/settings",
  },
]

const SidebarSm = ({ handleSelected, selected }: SidebarSmProps) => {
  return (
    <div className="bg-white py-2 border-t px-3 flex flex-row justify-between ">
      {routes.map((route) => (
        <Link
          key={route.id}
          to={route.path}
          onClick={() => handleSelected(route.id, route.name)}
          className={` ${
            route.id === selected
              ? "bg-primary text-white"
              : "text-[#00000099] hover:bg-slate-100"
          }   p-3 rounded-md `}
        >
          <route.icon size={22} />
        </Link>
      ))}
    </div>
  )
}

export default SidebarSm
