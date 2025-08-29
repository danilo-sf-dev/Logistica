import React from "react";
import type { MainContentProps } from "../types";

export const MainContent: React.FC<MainContentProps> = ({
  children,
  className = "",
}) => {
  return (
    <main
      className={`flex-1 relative z-0 overflow-y-auto focus:outline-none ${className}`}
    >
      <div className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
      </div>
    </main>
  );
};

export default MainContent;
