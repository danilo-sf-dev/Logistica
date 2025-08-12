import React from "react";
import type { ConfigTab } from "../types";

interface ConfiguracoesTabsProps {
  tabs: ConfigTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const ConfiguracoesTabs: React.FC<ConfiguracoesTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="h-4 w-4 inline mr-2" />
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ConfiguracoesTabs;
