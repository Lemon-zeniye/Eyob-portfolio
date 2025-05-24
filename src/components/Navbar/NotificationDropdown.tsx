import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronRight, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getNotifications,
  updateNotification,
  deleteNotification,
} from "@/Api/post.api";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useRole } from "@/Context/RoleContext";

const NotificationDropdown = () => {
  const queryClient = useQueryClient();
  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const { mode } = useRole();
  const primaryColor = mode === "formal" ? "primary" : "primary2";

  const updateMutation = useMutation({
    mutationFn: updateNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification marked as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted");
    },
  });

  const notifications = notificationsResponse?.data || [];
  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  const handleMarkAsRead = useCallback(
    (id: string) => {
      updateMutation.mutate({ id: id, payload: { readStatus: true } });
    },
    [updateMutation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell size={25} className="text-[#333333]" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[22rem] mt-2 p-0 rounded-xl shadow-lg border border-gray-100"
        align="end"
      >
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={() =>
                notifications.forEach(
                  (n) => !n.readStatus && handleMarkAsRead(n._id)
                )
              }
              className={`text-sm text-${primaryColor} hover:text-${primaryColor}/50`}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`relative overflow-hidden border-b border-gray-100 transition-all ${
                  !notification.readStatus ? "bg-blue-50" : ""
                }`}
              >
                {/* Clickable card area */}
                <div
                  className={`p-4 hover:bg-gray-50 transition-transform duration-300 ${
                    expandedId === notification._id ? "-translate-x-24" : ""
                  }`}
                  onClick={() => handleCardClick(notification._id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        User Name
                      </p>
                      <p className="text-gray-600 text-sm">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    {!notification.readStatus && (
                      <div
                        className={`h-2 w-2 bg-${primaryColor} rounded-full mt-2`}
                      />
                    )}
                  </div>
                </div>

                {/* Action buttons - animated appearance */}
                <div
                  className={`absolute right-0 top-0 h-full flex items-center space-x-1 pr-2 transition-all duration-300 ${
                    expandedId === notification._id
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                >
                  {!notification.readStatus && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification._id);
                      }}
                      className={`h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors`}
                      aria-label="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
                    className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                    aria-label="Delete notification"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button
              className={`text-sm font-medium text-${primaryColor} hover:text-${primaryColor}/50 flex items-center justify-center gap-1 w-full`}
            >
              View all notifications
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
