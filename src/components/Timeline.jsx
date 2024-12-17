import React, { useState } from "react";
import ParticipantRow from "./ParticipantRow";
import sessionData from "../data/sessionData.json";
import { format, addMinutes } from "date-fns";

const Timeline = () => {
  const { participantArray, start, end } = sessionData;

  const [showParticipants, setShowParticipants] = useState(true); // State to toggle participant rows

  // Generate timeline labels based on the session start and end times
  const generateTimelineLabels = (startTime, endTime) => {
    const labels = [];
    let currentTime = new Date(startTime); // Convert start time to a Date object
    const end = new Date(endTime); // Convert end time to a Date object

    // Loop to generate labels at 2-minute intervals
    while (currentTime <= end) {
      labels.push(format(currentTime, "HH:mm")); // Format as "HH:mm"
      currentTime = addMinutes(currentTime, 2); // Increment by 2 minutes
    }

    return labels;
  };

  // Generate the labels
  const timelineLabels = generateTimelineLabels(start, end);

  return (
    <div className="p-6 bg-gray-800 min-h-fit relative">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-white">
          Participant-wise Session Timeline
        </h1>

        <button
          onClick={() => setShowParticipants(!showParticipants)} // Toggle visibility
          className="flex items-center space-x-2 text-white"
        >
          <h1>Show Participant Timeline</h1>

          {/* Toggle switch */}
          <div
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              showParticipants ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                showParticipants ? "transform translate-x-5" : ""
              }`}
            />
          
          </div>
        </button>
      </div>
      <hr />
<br />
      {/* Timeline Row */}
      <div className="common-timeline-row flex justify-between items-center text-xs text-gray-300 bg-gray-700 py-2 px-4 rounded-md mb-6">
        {timelineLabels.map((label, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            style={{
              width: `${100 / timelineLabels.length}%`, // Distribute evenly
              textAlign: "center",
            }}
          >
            <span className="text-gray-400">{label}</span>
          </div>
        ))}
      </div>


      {/* Toggle Participants */}
      {showParticipants && (
        <div className="timeline-container z-10"
        style={{
          background: "linear-gradient(to right, rgba(255, 255, 255, 0.1) 2px, transparent 2px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 2px, transparent 2px)",
          backgroundSize: "240px 190px", // Increased grid spacing
        }}
        > {/* Ensure the participants are on top */}
          {participantArray.map((participant) => (
            <ParticipantRow
              key={participant.participantId}
              participant={participant}
              sessionStart={start}
              sessionEnd={end}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
