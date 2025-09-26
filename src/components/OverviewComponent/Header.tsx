'use client'

import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import SegmentedToggle from "./SegmentedToggle";
import InfoButton from "./InfoButton";


export default function Header() {
    const [mode, setMode] = useState<"Professional" | "Employee">("Professional");
    return (
        <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Toggle sidebar"
                    onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('toggle-sidebar'))}
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50"
                >
                    <Menu className="h-5 w-5 text-gray-700" />
                </button>
                <h1 className="text-lg font-normal text-black text-[24px]" >HR Overview</h1>
            </div>
            <div className="flex items-center space-x-4">
                <InfoButton
                    tooltip={`Switch to ${mode === "Professional" ? "Employee" : "Professional"}`}
                    style1 ="top-full"
                    style2="-top-1"
                />
                <SegmentedToggle value={mode} onChange={setMode} />
            </div>
        </header>
    );
}