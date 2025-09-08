import React from "react";
import { NavLink } from "react-router-dom";
import { X, LogOut, Truck } from "lucide-react";
import { PermissionService } from "../../../services/permissionService";
import NotificationBell from "../../common/NotificationBell";
import type { SidebarProps } from "../types";

export const Sidebar: React.FC<SidebarProps> = ({
  navigation,
  isOpen,
  onClose,
  userProfile,
  onLogout,
  className = "",
}) => {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar para mobile */}
      <div
        className={`fixed inset-0 flex z-50 md:hidden ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                SGL
              </span>
            </div>
            <button
              type="button"
              className="flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 h-0 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? "bg-primary-100 text-primary-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Perfil do usuário na sidebar mobile */}
            {userProfile && (
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center w-full">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">
                      {userProfile.displayName || "Usuário"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {PermissionService.getRoleDisplayName(
                        userProfile.role as any,
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex-shrink-0 bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between flex-shrink-0 px-4 mb-2">
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-primary-600" />
                  <span className="ml-2 text-xl font-semibold text-white">
                    SGL
                  </span>
                </div>
                {/* Notification Bell para desktop */}
                <div className="flex-shrink-0">
                  <NotificationBell className="text-gray-300 hover:text-white" />
                </div>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? "bg-primary-100 text-primary-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
            {userProfile && (
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      {userProfile.displayName || "Usuário"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {PermissionService.getRoleDisplayName(
                        userProfile.role as any,
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
