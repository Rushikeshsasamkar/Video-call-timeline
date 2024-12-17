import React from "react";
import Tooltip from "./Tooltip";

const TimelineEvent = ({ type, start, end, message, sessionStart, sessionEnd }) => {
  // Calculate position in percentage
  const calculatePosition = (time) => {
    const sessionDuration = new Date(sessionEnd).getTime() - new Date(sessionStart).getTime();
    const timeOffset = new Date(time).getTime() - new Date(sessionStart).getTime();
    return (timeOffset / sessionDuration) * 100; // Return percentage position
  };

  // Event icons for different event types
  const eventIcons = {
    mic: "🎤",
    webcam: "📷",
    error: "⚠️",
    timelog: "🔵",
  };

  // Calculate event width if it has a duration (e.g., mic, webcam, error)
  const calculateWidth = () => {
    if (end) {
      const eventDuration = new Date(end).getTime() - new Date(start).getTime();
      const sessionDuration = new Date(sessionEnd).getTime() - new Date(sessionStart).getTime();
      return (eventDuration / sessionDuration) * 100; // Return percentage width
    }
    return 0; // If no end time, width is 0 (for single point events like "timelog")
  };

  const position = calculatePosition(start);
  const width = calculateWidth();

  return (
    <div
      className="absolute"
      style={{
        left: `${position}%`,
        width: `${width}%`, 
        bottom: "20px", 
        height: "30px", 
      }}
    >
      <Tooltip message={message || `${type} event`}>
        <div
          className={`h-8 w-8 flex items-center justify-center text-white rounded-full ${
            type === "error" ? "bg-red-500" : type === "mic" ? "bg-green-300" : type === "webcam" ? "bg-blue-500" : "bg-gray-500"
          }`}
        >
          {eventIcons[type]}
        </div>
      </Tooltip>
    </div>
  );
};

export default TimelineEvent;
