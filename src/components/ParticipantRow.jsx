import React, { useState, useRef, useEffect } from "react";
import TimelineEvent from "./TimelineEvent";
import { format, parseISO } from "date-fns";

const ParticipantRow = ({ participant, sessionStart, sessionEnd }) => {
  const { name, events, timelog, participantId } = participant;

  const [showTooltip, setShowTooltip] = useState(false); // State to control tooltip visibility

  // Create refs for "View details" button and tooltip
  const tooltipRef = useRef(null);
  const detailsButtonRef = useRef(null);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMilliseconds = endTime - startTime;

    // Convert milliseconds to hours, minutes, and seconds
    const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    return `${minutes} Mins`;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    // Format the date in the desired format: "2 April 2024"
    const dateString = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Format the time in the desired format: "11:31"
    const timeString = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return `${dateString}, ${timeString}`;
  };

  // Helper function to get time in minutes
  const getTimeInMinutes = (time) => {
    const date = new Date(time);
    const sessionStartDate = new Date(sessionStart);
    const diff = (date - sessionStartDate) / 60000; // Convert to minutes
    return diff;
  };

  const handleClick = () => {
    // Toggle the tooltip visibility when clicked
    setShowTooltip((prevState) => !prevState);
  };

  // Effect hook to handle click outside and hide the tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside of the tooltip and button
      if (
        tooltipRef.current && !tooltipRef.current.contains(event.target) &&
        detailsButtonRef.current && !detailsButtonRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="participant-row my-4">
      <h3 className="font-semibold text-white mx-3">{capitalizeFirstLetter(name)} ({participantId.toUpperCase()})</h3>

      <p className="text-white text-sm mx-3">
        {formatDate(sessionStart)} | Duration {calculateDuration(sessionStart, sessionEnd)}
      </p>

      <p
        className="text-blue-500 text-m mx-3 cursor-pointer text-right"
        onClick={handleClick} // Toggle tooltip visibility on click
        ref={detailsButtonRef} // Reference for the button
      >
        View details {'>'}
      </p>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute right-0 top-10 bg-gray-700 text-white text-xs p-2 rounded-md shadow-lg w-48 z-20"
          ref={tooltipRef} // Reference for the tooltip
        >
          <h4 className="font-semibold">{capitalizeFirstLetter(name)} ({participantId.toUpperCase()})</h4>
          <p><strong>Session Start:</strong> {formatDate(sessionStart)}</p>
          <p><strong>Session End:</strong> {formatDate(sessionEnd)}</p>
          <p><strong>Total Duration:</strong> {calculateDuration(sessionStart, sessionEnd)}</p>
        </div>
      )}

      <div className="relative flex items-center h-16 border-b border-white">
        {/* Check if there are two time logs and adjust the blue line accordingly */}
        {timelog.length === 2 ? (
          <>
            {/* First half of the blue line */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 border-t-4 border-blue-500 w-1/2"></div>

            {/* Second half of the blue line */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 border-t-4 border-blue-100 w-1/2"></div>
          </>
        ) : (
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 border-t-4 border-blue-500 "></div>
        )}

        {/* Render TimelineEvents for different types */}
        {timelog.map((log, index) => (
          <TimelineEvent
            key={`log-${index}`}
            type="timelog"
            start={log.start}
            end={log.end}
            sessionStart={sessionStart}
            sessionEnd={sessionEnd}
            getTimeInMinutes={getTimeInMinutes}
          />
        ))}
        
        {events.mic.map((mic, index) => (
          <TimelineEvent
            key={`mic-${index}`}
            type="mic"
            start={mic.start}
            end={mic.end}
            sessionStart={sessionStart}
            sessionEnd={sessionEnd}
            getTimeInMinutes={getTimeInMinutes}
          />
        ))}

        {events.webcam.map((webcam, index) => (
          <TimelineEvent
            key={`webcam-${index}`}
            type="webcam"
            start={webcam.start}
            end={webcam.end}
            sessionStart={sessionStart}
            sessionEnd={sessionEnd}
            getTimeInMinutes={getTimeInMinutes}
          />
        ))}

        {events.errors?.map((error, index) => (
          <TimelineEvent
            key={`error-${index}`}
            type="error"
            start={error.start}
            message={error.message}
            sessionStart={sessionStart}
            sessionEnd={sessionEnd}
            getTimeInMinutes={getTimeInMinutes}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantRow;
