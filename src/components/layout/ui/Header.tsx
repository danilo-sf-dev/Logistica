import React from "react";
import { Menu } from "lucide-react";
import type { HeaderProps } from "../types";
import NotificationBell from "../../common/NotificationBell";

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  title,
  className = "",
}) => {
  return (
    <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          {title && (
            <h1 className="ml-2 text-lg font-medium text-gray-900 truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Notification Bell */}
        <div className="mr-4">
          <NotificationBell />
        </div>
      </div>
    </div>
  );
};

export default Header;
