"use client";
import React, { useEffect, useRef } from "react";

// ✅ Your image-based nav items (images must be inside /public/svgs/)
const navItems = [
  { label: "Overview", iconSrc: "/svgs/overview.svg", href: "#overview" },
  { label: "Calendar", iconSrc: "/svgs/calender.svg", href: "#calendar" },
  { label: "Playbook", iconSrc: "/svgs/playbook.svg", href: "#playbook" },
  { label: "Forms", iconSrc: "/svgs/forms.svg", href: "#forms" },
  { label: "Leaves", iconSrc: "/svgs/leaves.svg", href: "#leaves" },
  { label: "Collaborations", iconSrc: "/svgs/collab.svg", href: "#collaborations" },
];

export default function Sidebar({
  active,
  onSelect,
  mobileOpen,
  onClose,
}: {
  active?: string;
  onSelect?: (v: string) => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const [hash, setHash] = React.useState<string>(
    typeof window !== "undefined" && window.location.hash
      ? window.location.hash
      : "#overview"
  );

  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [mobileOpenLocal, setMobileOpenLocal] = React.useState(false);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#overview");
    window.addEventListener("hashchange", onHash);

    const onToggle = () => {
      setDesktopOpen((v) => !v);
      setMobileOpenLocal((v) => !v);
    };
    window.addEventListener("toggle-sidebar", onToggle as EventListener);

    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("toggle-sidebar", onToggle as EventListener);
    };
  }, []);

  const effectiveMobileOpen = mobileOpen === undefined ? mobileOpenLocal : mobileOpen;

  // ✅ Close sidebar when clicking/touching outside
  useEffect(() => {
    if (!effectiveMobileOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        onClose?.(); // call parent onClose if provided
        setMobileOpenLocal(false); // close local state version
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [effectiveMobileOpen, onClose]);

  const isActive = (href: string, label: string) => {
    if (active) return active.toLowerCase() === label.toLowerCase();
    return hash === href;
  };

  const Item = ({ item }: { item: (typeof navItems)[number] }) => {
    const activeNow = isActive(item.href, item.label);
    return (
      <a
        key={item.label}
        href={item.href}
        onClick={() => onSelect?.(item.label)}
      >
        <div
          className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
            activeNow
              ? "bg-red-100 text-[#821A1E]"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <img
            src={item.iconSrc}
            alt={item.label}
            className={`w-5 h-5 object-contain ${
              activeNow ? "opacity-100" : "opacity-70"
            }`}
          />
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      </a>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex bg-white border-r flex-col min-h-screen transition-all duration-300 overflow-hidden ${
          desktopOpen ? "w-64 p-4" : "w-0"
        }`}
        aria-hidden={!desktopOpen}
      >
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Item key={item.label} item={item} />
          ))}
        </nav>
      </aside>

      {/* Mobile drawer */}
      {effectiveMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Sidebar */}
          <aside
            ref={sidebarRef}
            className="absolute left-0 top-0 h-full w-64 bg-white border-r p-4 flex flex-col"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Item key={item.label} item={item} />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
