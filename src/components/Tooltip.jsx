import React from "react";

const Tooltip = ({ message, children }) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-10 left-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2">
        {message}
      </div>
    </div>
  );
};

export default Tooltip;
