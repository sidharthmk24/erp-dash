"use client";
import React, { useMemo, useState, useCallback, useRef } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import InfoButton from "./InfoButton";
import { people, Person } from "@/utils/employe";

type Reminder = { name: string; note: string };

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function RightSidebar({ onHasContentChange }: { onHasContentChange?: (has: boolean) => void }) {
  // Calendar state
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  // Start index for 7-day viewport (0-based day of month index)
  const [startIdx, setStartIdx] = useState<number>(0);
  // Selected absolute index (0-based in current month)
  const [selectedAbsIdx, setSelectedAbsIdx] = useState<number>(
    today.getMonth() === cursor.getMonth() && today.getFullYear() === cursor.getFullYear()
      ? today.getDate() - 1
      : 0
  );
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [attendanceMenuOpen, setAttendanceMenuOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showAttendance, setShowAttendance] = useState(true);

  // Notify parent whether any widget is visible
  React.useEffect(() => {
    onHasContentChange?.(showCalendar || showAttendance);
  }, [showCalendar, showAttendance, onHasContentChange]);

  const handleRemoveWidget = (widgetName: string) => {
    if (widgetName === "Calendar") {
      setShowCalendar(false);
      setCalendarMenuOpen(false);
    } else if (widgetName === "Attendance") {
      setShowAttendance(false);
      setAttendanceMenuOpen(false);
    }
  };

  const totalDays = useMemo(
    () => daysInMonth(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const monthLabel = useMemo(
    () => cursor.toLocaleString("en-US", { month: "short" }),
    [cursor]
  );

  const clampStart = useCallback(
    (idx: number) => Math.max(0, Math.min(idx, Math.max(0, totalDays - 7))),
    [totalDays]
  );

  const clampSelected = useCallback(
    (idx: number) => Math.max(0, Math.min(idx, totalDays - 1)),
    [totalDays]
  );

  const keepSelectionInView = useCallback(
    (selIdx: number) => {
      if (selIdx < startIdx) {
        setStartIdx(clampStart(selIdx));
      } else if (selIdx > startIdx + 6) {
        setStartIdx(clampStart(selIdx - 6));
      }
    },
    [startIdx, clampStart]
  );

  // Safely change month and apply a selected index in that month
  const setMonthAndSelect = useCallback(
    (year: number, month: number, selectIdx: number) => {
      const td = daysInMonth(year, month);
      const clampedSel = Math.max(0, Math.min(selectIdx, td - 1));
      setCursor(new Date(year, month, 1));
      setSelectedAbsIdx(clampedSel);
      // viewport start so that selected stays visible
      const maxStart = Math.max(0, td - 7);
      const start = Math.max(0, Math.min(clampedSel, maxStart));
      setStartIdx(start);
    },
    []
  );

  const selectNext = useCallback(() => {
    setSelectedAbsIdx((prev) => {
      const next = prev + 1;
      if (next <= totalDays - 1) {
        keepSelectionInView(next);
        return next;
      }
      // move to first day of next month
      const y = cursor.getFullYear();
      const m = cursor.getMonth();
      setMonthAndSelect(y + Math.floor((m + 1) / 12), (m + 1) % 12, 0);
      return prev; // temporary value, will be replaced by setMonthAndSelect
    });
  }, [totalDays, keepSelectionInView, cursor, setMonthAndSelect]);

  const selectPrev = useCallback(() => {
    setSelectedAbsIdx((prev) => {
      const next = prev - 1;
      if (next >= 0) {
        keepSelectionInView(next);
        return next;
      }
      // move to last day of previous month
      const m = cursor.getMonth();
      const y = cursor.getFullYear();
      const prevMonth = m - 1;
      const targetMonth = (prevMonth + 12) % 12;
      const targetYear = y + Math.floor((m - 1) / 12);
      const tdPrev = daysInMonth(targetYear, targetMonth);
      setMonthAndSelect(targetYear, targetMonth, tdPrev - 1);
      return prev; // temporary
    });
  }, [keepSelectionInView, cursor, setMonthAndSelect]);

  const viewDates = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dayOfMonth = startIdx + i + 1; // 1-based date
      arr.push(new Date(cursor.getFullYear(), cursor.getMonth(), dayOfMonth));
    }
    return arr;
  }, [cursor, startIdx]);

  // Selected date object and events filtered by that date
  const selectedDateObj = useMemo(
    () => new Date(cursor.getFullYear(), cursor.getMonth(), selectedAbsIdx + 1),
    [cursor, selectedAbsIdx]
  );
  const eventsForSelected: Reminder[] = useMemo(() => {
    const d = selectedDateObj.getDate();
    const m = selectedDateObj.getMonth();
    const reminders: Reminder[] = [];
    // Birthdays
    people.forEach((p: Person) => {
      const b = new Date(p.birthday);
      if (!isNaN(b.getTime()) && b.getDate() === d && b.getMonth() === m) {
        reminders.push({ name: p.name, note: "Birthday" });
      }
    });
    // Work Anniversaries
    people.forEach((p: Person) => {
      const j = new Date(p.joining);
      if (!isNaN(j.getTime()) && j.getDate() === d && j.getMonth() === m) {
        reminders.push({ name: p.name, note: "Work Anniversary" });
      }
    });
    return reminders;
  }, [people, selectedDateObj]);

  const onMonthClick = (e: React.MouseEvent) => {
    const dir = e.shiftKey ? -1 : 1; // Shift+Click = previous month
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1);
    setCursor(next);
    setStartIdx(0);
    // reset selected index to 0 or today if same month/year
    if (
      today.getMonth() === next.getMonth() &&
      today.getFullYear() === next.getFullYear()
    ) {
      setSelectedAbsIdx(today.getDate() - 1);
      setStartIdx(clampStart(today.getDate() - 1));
    } else {
      setSelectedAbsIdx(0);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 5) return;
    if (delta > 0) selectNext(); else selectPrev();
  };

  const stripRef = useRef<HTMLDivElement | null>(null);
  // Touch drag
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 20) {
      if (dx < 0) selectNext(); else selectPrev();
    }
    touchX.current = null;
  };

  // Mouse drag
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const dragAccum = useRef(0);
  const STEP_PX = 40; // horizontal pixels per one-day shift

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragAccum.current = 0;
    // make sure the strip can get key events
    (stripRef.current as HTMLDivElement | null)?.focus();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current == null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = e.clientX;
    dragAccum.current += dx;
    while (Math.abs(dragAccum.current) >= STEP_PX) {
      if (dragAccum.current > 0) {
        selectPrev();
        dragAccum.current -= STEP_PX;
      } else {
        selectNext();
        dragAccum.current += STEP_PX;
      }
    }
  };

  const endDrag = () => {
    isDragging.current = false;
    dragStartX.current = null;
    dragAccum.current = 0;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") selectNext();
    if (e.key === "ArrowLeft") selectPrev();
  };

  return (
    <aside className="w-full xl:w-[320px] flex flex-col space-y-4">
      {/* Calendar + Events */}
      {showCalendar && (
      <div className="relative rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm flex flex-col">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-1.5">
            <button onClick={onMonthClick} className="text-[24px] font-normal text-gray-900 hover:opacity-80">
              {monthLabel}
            </button>
            <InfoButton tooltip="Displayed via Team Calendar"
              style1="bottom-full"
              style2="-bottom-1"


            />
          </div>

          {/* Top Right MoreVertical with Dropdown */}
          <div className="relative">
            <MoreVertical
              className="text-gray-400 cursor-pointer"
              size={20}
              onClick={() => setCalendarMenuOpen((prev) => !prev)}
            />
            {calendarMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-gray-200 z-10">
                <button
                  onClick={() => handleRemoveWidget("Calendar")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} /> Remove Widget
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Row */}
        <div className="px-4 pt-2 pb-2" onWheel={onWheel}>
          <div
            ref={stripRef}
            className="grid grid-cols-7 text-center select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            {viewDates.map((d, i) => {
              const absIdx = startIdx + i; // absolute index in month
              const active = absIdx === selectedAbsIdx;
              const day = d.getDate();
              const dow = d.toLocaleString("en-US", { weekday: "short" });
              return (
                <div
                  key={i}
                  onClick={() => setSelectedAbsIdx(absIdx)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition duration-300 ease-in-out ${active ? "bg-[#FFE1E2]" : ""}`}
                >
                  <div className={`text-[16px] leading-tight ${active ? "text-[#821A1E] font-semibold" : "text-[#CFCFCF]"}`}>
                    {String(day).padStart(2, "0")}
                  </div>
                  <div className={`text-[14px] ${active ? "text-[#821A1E] font-medium" : "text-[#CFCFCF]"}`}>
                    {dow}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Events filtered to the selected date */}
        <div className="border-t max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-2 py-2 flex flex-col items-center gap-3">
          {eventsForSelected.length === 0 && (
            <div className="text-[12px] text-gray-500 py-6">No reminders for {selectedDateObj.toLocaleString("en-US", { day: "2-digit", month: "short" })}</div>
          )}
          {eventsForSelected.map((e) => (
            <div
              key={e.name}
              className="flex justify-between w-full max-w-[300px] px-4 py-6 rounded-lg border border-gray-200  bg-white"
            >
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-gray-900">
                  {e.name}
                </span>
                <span className="text-[11px] text-gray-500">{e.note}</span>
              </div>
              <div className="text-right">
                <span className="block text-[15px] font-semibold text-gray-900 leading-none">
                  {String(selectedDateObj.getDate()).padStart(2, "0")}
                </span>
                <span className="text-[11px] text-gray-400">{selectedDateObj.toLocaleString("en-US", { weekday: "short" })}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
      )}

      {/* Attendance Section */}
      {showAttendance && (
      <div className="relative rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm flex flex-col flex-1">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[24px] font-normal text-gray-900">
              Attendance
            </span>
          </div>

          {/* Attendance Actions */}
          <div className="relative flex gap-2">
            <button className="text-[11px] border border-gray-500 rounded-full px-5 py-2 text-[#838383] hover:text-gray-700 transition">
              Update
            </button>
            <MoreVertical
              className="text-gray-400 cursor-pointer mt-1"
              size={26}
              onClick={() => setAttendanceMenuOpen((prev) => !prev)}
            />
            {attendanceMenuOpen && (
              <div className="absolute right-0 mt-8 w-40 rounded-md bg-white shadow-lg ring-1 ring-gray-200 z-10">
                <button
                  onClick={() => handleRemoveWidget("Attendance")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} /> Remove Widget
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center flex-1 pb-4 pt-4">
          <div className="relative h-36 w-36">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="5"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#FFA2A5"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${(1 - 0.92) * 2 * Math.PI * 16}`}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[20px] font-semibold text-gray-900">
                98.00%
              </span>
              <span className="text-[11px] text-gray-500">
                Team Expected Today
              </span>
              <InfoButton tooltip="Displayed via Team Calendar"
                style1="bottom-full"
                style2="-bottom-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-[10px] p-4 text-gray-400">
          Last Updated: 08:58 AM
        </div>
      </div>
      )}
    </aside>
  );
}
