import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";
import { JwtPayload, UserInfo } from "@/Types/profile.type";
import { toast } from "sonner";
import { Role } from "@/Types/auth.type";
import { format, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ConvertToDateOnly = (date: string | number): string => {
  const parsedDate = new Date(date);

  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear().toString().slice(-2);

  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
};

export const ConvertToDate = (date: string): string => {
  const parsedDate = new Date(date);

  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear().toString().slice(-2);
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();

  const formattedDate = `${month}/${day}/${year} ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return formattedDate;
};

export const getUserFromToken = (token: string | null): UserInfo | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const aud = decoded.aud || [];

    return {
      id: aud.find((item): item is { _id: string } => !!item?._id)?._id,
      name: aud.find((item): item is { name: string } => !!item?.name)?.name,
      role: aud.find((item): item is { role: Role } => !!item?.role)?.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

type DateParts = {
  year: number;
  month: number;
  day: number;
};

export function getDateParts(dateString: string): DateParts {
  const date = new Date(dateString);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1, // Months are 0-indexed
    day: date.getUTCDate(),
  };
}

export function formatDateToMonthYear(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };

  return date.toLocaleDateString("en-US", options);
}

export const tos = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        backgroundColor: "#4ade80",
        color: "white",
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
};

export function formatMessageTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HasCreatedAt {
  createdAt: string;
}

export function groupMessagesByDate<T extends HasCreatedAt>(messages: T[]) {
  const groups: { [key: string]: T[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt);
    let label = format(date, "yyyy-MM-dd");

    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(message);
  });

  return groups;
}
