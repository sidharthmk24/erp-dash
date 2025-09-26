"use client";
import React from "react";

type Props = {
  value: "Professional" | "Employee";
  onChange?: (v: "Professional" | "Employee") => void;
};

export default function SegmentedToggle({ value, onChange }: Props) {
  const items: ("Professional" | "Employee")[] = ["Professional", "Employee"];
  return (
    <div className="relative inline-flex rounded-full bg-[#F9F9F9] p-1 text-sm">
      {items.map((it) => {
        const active = value === it;
        return (
          <button
            key={it}
            onClick={() => onChange?.(it)}
            className={[
              "relative z-10 rounded-full px-3.5 py-2 font-medium transition-colors",
              active ? "text-white" : "text-[#989898]",
            ].join(" ")}
            style={{}}
          >
            {it}
            {active && (
              <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#F43F46]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
