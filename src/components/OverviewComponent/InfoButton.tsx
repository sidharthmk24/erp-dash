"use client";
import React from "react";
import { Info } from "lucide-react";

interface infoprops {
  style1: string;
  style2: string;
}

export default function InfoButton({ tooltip ,style1,style2 } : { tooltip: string , style1: string , style2: string}) {
  return (
    <div className="group relative inline-flex">
      <button
        className="inline-flex h-7 w-7   items-center justify-center rounded-full text-[#989898] hover:text-gray-700 hover:bg-gray-50"
        aria-label="Info"
        type="button"
      >
        <Info size={14} />
      </button>
      {/* Tooltip bubble (above icon) */}
      <div
        className={`pointer-events-none absolute  left-1/2  ${style1} z-30 mb-2 -translate-x-1/2 scale-95 rounded-md bg-[#1f1f1f] px-3.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap`}
        role="tooltip"
      >
        {tooltip}
        {/* Arrow */}
        <div className={`absolute left-1/2  ${style2} h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-[#1f1f1f] shadow-[0_2px_6px_rgba(0,0,0,0.25)]`} />
      </div>
    </div>
  );
}
