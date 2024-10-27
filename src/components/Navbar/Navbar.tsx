import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import NotificationDropdown from "./NotificationDropdown"
import UserDropdown from "./UserDropdown"

interface NavbarProps {
  name: string
}

const Navbar = ({ name }: NavbarProps) => {
  const location = useLocation()
  const [displayName, setDisplayName] = useState(name)

  useEffect(() => {
    if (location.pathname === "/profile") {
      setDisplayName("Profile")
    } else {
      setDisplayName(name)
    }
  }, [location.pathname, name])

  return (
    <div className="flex flex-row justify-between items-center pr-5 py-2">
      <p className="text-lg font-bold">{displayName}</p>
      <div className="flex flex-row gap-7 items-center">
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default Navbar
