import { Route } from "@/Pages/Main/Sidebar"
import { Link, useLocation } from "react-router-dom"

interface SidebarSmProps {
  handleSelected: (name: string) => void
  routes: Route[]
}

const SidebarSm = ({ handleSelected, routes }: SidebarSmProps) => {
  const location = useLocation()

  return (
    <div className="bg-white py-2 border-t px-3 flex flex-row justify-between">
      {routes.map((route) => (
        <Link
          key={route.id}
          to={route.path}
          onClick={() => handleSelected(route.name)}
          className={`${
            location.pathname === route.path
              ? "bg-primary text-white"
              : "text-[#00000099] hover:bg-slate-100"
          } p-3 rounded-md`}
        >
          <route.icon size={22} />
        </Link>
      ))}
    </div>
  )
}

export default SidebarSm
