"use client";
import React from "react";
import OurTeam from "./OurTeam";
import RightSidebar from "./RightSidebar";


export default function Dashboard() {
  const [hasRightContent, setHasRightContent] = React.useState(true);
  return (
    <div className="relative flex-1 bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <h2 className="text-[28px] font-normal text-gray-900 mb-4">Hey Kian!</h2>
        <div className={`grid grid-cols-1 ${hasRightContent ? "xl:grid-cols-[1fr_320px]" : "xl:grid-cols-1"} gap-6 items-start`}>
          <div>
            <OurTeam />
          </div>
          {hasRightContent && (
            <RightSidebar onHasContentChange={setHasRightContent} />
          )}
        </div>
      </div>
    </div>
  );
}
