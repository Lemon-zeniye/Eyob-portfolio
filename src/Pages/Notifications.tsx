import type React from "react"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  AlertTriangleIcon,
  BellIcon,
  CheckIcon,
  Info,
  XIcon,
} from "lucide-react"

interface NotificationType {
  id: string
  type: "info" | "success" | "warning" | "default"
  title: string
  message: string
  timestamp: string
  image?: string
  read: boolean
}

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

const getMockNotifications = (): NotificationType[] => {
  return [
    {
      id: "1",
      type: "info",
      title: "New feature available",
      message: "Check out our new dashboard layout with improved analytics.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      image: "/placeholder.svg?height=200&width=300",
      read: false,
    },
    {
      id: "2",
      type: "success",
      title: "Payment processed",
      message: "Your subscription payment was successfully processed.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Storage limit approaching",
      message:
        "You're using 80% of your storage quota. Consider upgrading your plan.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
    },
    {
      id: "4",
      type: "default",
      title: "Team invitation",
      message: "Sarah invited you to join the Design team.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      image: "/placeholder.svg?height=200&width=300",
      read: true,
    },
    {
      id: "5",
      type: "info",
      title: "Account security",
      message:
        "We recommend enabling two-factor authentication for added security.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      read: true,
    },
  ]
}

const NotificationSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse"></div>
          <div className="h-3 w-full bg-gray-200 animate-pulse"></div>
          <div className="h-2 w-1/4 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

interface NotificationProps {
  notification: NotificationType
  onDismiss: (id: string) => void
}

const Notification: React.FC<NotificationProps> = ({
  notification,
  onDismiss,
}) => {
  const { id, type, title, message, timestamp, image, read } = notification

  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info />
      case "success":
        return <CheckIcon />
      case "warning":
        return <AlertTriangleIcon />
      default:
        return <BellIcon />
    }
  }

  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md",
        !read && "border-l-4 border-l-blue-500"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="mt-0.5">{getIcon()}</div>
          <div className="flex-1 space-y-1">
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">{message}</p>
            {image && (
              <div className="mt-2 overflow-hidden rounded-md">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Notification image"
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-gray-500"
          onClick={() => onDismiss(id)}
        >
          <XIcon />
        </button>
      </div>
    </div>
  )
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const data = getMockNotifications()
      setNotifications(data)
      setLoading(false)
    }

    fetchNotifications()
  }, [])

  const handleDismiss = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Notifications
        </h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
