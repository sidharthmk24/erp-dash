"use client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import InfoButton from "./InfoButton";

export default function Sidebar() {
  const [showCalendar, setShowCalendar] = useState(true);
  const [showAttendance, setShowAttendance] = useState(true);

  const handleRemoveWidget = (widgetName: string) => {
    if (widgetName === "Calendar") setShowCalendar(false);
    if (widgetName === "Attendance") setShowAttendance(false);
  };

  return (
    <aside className="w-full xl:w-[320px] flex flex-col space-y-4">
      {/* Calendar Section */}
      {showCalendar && (
        <div className="relative rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">Calendar</h3>
            <button
              onClick={() => handleRemoveWidget("Calendar")}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
              Remove Widget
            </button>
          </div>
          {/* Replace this with your actual calendar component */}
          <div className="p-4 text-sm text-gray-500">Calendar content...</div>
        </div>
      )}

      {/* Attendance Section */}
      {showAttendance && (
        <div className="relative rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm flex flex-col flex-1">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">Attendance</h3>
            <button
              onClick={() => handleRemoveWidget("Attendance")}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
              Remove Widget
            </button>
          </div>
          {/* Replace this with your actual attendance component */}
          <div className="p-4 text-sm text-gray-500">
            Attendance data and stats...
          </div>
        </div>
      )}
    </aside>
  );
}
