"use client";
import React, { useState } from "react";
import InfoButton from "./InfoButton";
import { Search, Maximize2, Minimize2, X } from "lucide-react";
import { people as initialPeople } from "@/utils/employe";

export default function OurTeam() {
  const [expanded, setExpanded] = useState(false); // we will still keep for hover effect
  const [modalOpen, setModalOpen] = useState(false); // modal state
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [people, setPeople] = useState(initialPeople);

  // Toggle sort direction
  const toggleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    setPeople((prev) =>
      [...prev].sort((a, b) =>
        newDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
    );
  };

  return (
    <section
      className={`group/ourteam rounded-lg bg-white ring-1 ring-gray-200 shadow-sm transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[24px] font-semibold text-gray-900">Our Team</h3>
          <InfoButton
            tooltip="Explore team member profiles and their key details"
            style1="bottom-full"
            style2="-bottom-1"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Expand button triggers modal */}
          <button
            onClick={() => setModalOpen(true)}
            className={`p-2 rounded-full hover:bg-gray-100 transition-opacity opacity-100`}
            title="Expand Modal"
            aria-label="Expand Modal"
          >
            <Maximize2 size={16} className="text-gray-600" />
          </button>

          {/* Search box */}
          <div className="relative">
            <input
              placeholder="Search"
              className="w-26 rounded-sm border pl-9 pr-3 py-1.5 text-sm focus:outline-none"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-[#838383]" />
          </div>
        </div>
      </div>

      {/* Original table (unchanged) */}
      <div className={`transition-all ${expanded ? "max-h-[calc(80vh-150px)]" : "max-h-[520px]"} overflow-auto`}>
        <div className="px-5">
          <table className="w-full text-sm border-collapse table-fixed mx-auto">
            <thead className="text-[16px] font-medium text-[#989898] border-b-2 border-[#98989828]">
              <tr className="align-middle">
                <th className="py-3 pl-6 text-left font-medium w-[30%]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleSort}
                      className="inline-flex items-center gap-1 hover:text-black transition-colors"
                    >
                      {sortDirection === "asc" ? (
                        <img src="/svgs/sortIcon.svg" alt="Sort Asc" className="w-2 h-3 hover:opacity-80 transition" />
                      ) : (
                        <img src="/svgs/sortIcon.svg" alt="Sort Desc" className="w-2 h-3 hover:opacity-80 transition" />
                      )}
                    </button>
                    <span className="text-[16px]">Name</span>
                  </div>
                </th>
                <th className="py-3 text-left font-medium w-[11%]"></th>
                <th className="py-3 text-left font-medium px-4 w-[19%] text-[16px]">Employment Type</th>
                <th className="py-3 text-left font-medium px-4 w-[14%] text-[16px]">Joining Date</th>
                <th className="py-3 text-left font-medium px-4 w-[14%] text-[16px]">Birthday</th>
                <th className="py-3 pr-6 text-left font-medium w-[6%] text-[16px]">
                  <button>
                    <img src="/svgs/plusIcon.svg" alt="Add" className="w-3.5 h-3.5 hover:opacity-80 transition" />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {people.map((p, idx) => (
                <tr key={p.id || p.name + idx} className="border-b-2 border-[#98989828] align-middle">
                  <td className="py-2 px-6 text-gray-800 font-medium text-[14px]">{p.name}</td>
                  <td className="py-2">
                    {p.badges.length > 0 && (
                      <div className="flex items-center gap-1 justify-center rounded-full bg-red-50 px-2 py-3 ring-1 ring-red-200 mx-auto"
                        style={{
                          width: `${24 + p.badges.length * 12}px`,
                          minHeight: "12px",
                          maxHeight: "12px",
                        }}
                      >
                        {p.badges.map((b, i) => (
                          <img key={i} src={b} alt="badge" className="object-contain"
                            style={{ width: `${p.badges.length === 1 ? 20 : 16}px`, height: "auto" }}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 text-gray-700 text-[14px]">{p.type}</td>
                  <td className="py-2 px-4 text-gray-700 text-[14px]">{p.joining}</td>
                  <td className="py-2 px-4 text-gray-700 text-[14px]">{p.birthday}</td>
                  <td className="py-2 pr-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

   {/* Modal */}
{modalOpen && (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto">
    <div className="bg-white rounded-lg w-[100%] max-w-7xl mt-12 p-6 relative">
      {/* Modal Header Row */}
      <div className="flex items-center justify-end mb-4">
        {/* Left: Title */}
          <h3 className="text-[24px] font-semibold text-gray-900">Our Team</h3>

      
<div className=" flex items-center ml-auto ">
  {/* Right: Add Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F43F46] text-white rounded-full hover:[#89272b] transition">
          <img src="/svgs/profilePlus.svg" alt="Add" className="w-4 h-4 object-contain" />
          Add New Team Member
        </button>
          <div className="flex-1 mx-4 relative">
          <input
            placeholder="Search"
            className="w-25 rounded-sm border pl-9 pr-3 py-1.5 text-sm focus:outline-none"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-[#838383]" />
        </div>

        {/* Close Button */}
        <button
          onClick={() => setModalOpen(false)}
          className=" p-2 rounded-full text-[#000000b2] hover:text-[black] transition"
        >
          <X size={20} />
        </button>
</div>
        
      </div>

      {/* Table in modal */}
      <div className="overflow-auto max-h-[70vh]">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="text-[16px] font-medium text-[#989898] border-b-2 border-[#98989828]">
            <tr className="align-middle">
              <th className="py-3 pl-4 text-left w-[5%]">#</th>
              <th className="py-3 pl-4 text-left w-[25%]">
                <button
                  onClick={toggleSort}
                  className="inline-flex items-center gap-1 hover:text-black transition-colors"
                >
                  {sortDirection === "asc" ? (
                    <img src="/svgs/sortIcon.svg" alt="Sort Asc" className="w-2 h-3" />
                  ) : (
                    <img src="/svgs/sortIcon.svg" alt="Sort Desc" className="w-2 h-3" />
                  )}
                  Name
                </button>
              </th>
              <th className="py-3 text-left w-[15%]"></th>
              <th className="py-3 px-4 text-left w-[20%]">Employment Type</th>
              <th className="py-3 px-4 text-left w-[15%]">Joining Date</th>
              <th className="py-3 px-4 text-left w-[15%]">Birthday</th>
              <th className="py-3 pr-6 text-left w-[10%]"></th>
            </tr>
          </thead>

          <tbody>
            {people.map((p, idx) => (
              <tr key={p.id || p.name + idx} className="border-b border-[#98989828] align-middle">
                <td className="py-2 px-4 text-gray-800 font-medium">{idx + 1}</td>
                <td className="py-2 px-4 text-gray-800 font-medium">{p.name}</td>
                <td className="py-2 text-center">
                  {p.badges.length > 0 && (
                    <div
                      className="flex items-center gap-0.5 justify-center rounded-full bg-red-50 px-2 py-1 ring-1 ring-red-200 mx-auto"
                      style={{
                        width: `${24 + p.badges.length * 12}px`,
                        // minHeight: "20px",
                        // maxHeight: "20px",
                      }}
                    >
                      {p.badges.map((b, i) => (
                        <img
                          key={i}
                          src={b}
                          alt="badge"
                          className="object-contain "
                          style={{ width: `${p.badges.length === 1 ? 20 : 16}px`, height: "auto" }}
                        />
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-2 px-4 text-gray-700">{p.type}</td>
                <td className="py-2 px-4 text-gray-700">{p.joining}</td>
                <td className="py-2 px-4 text-gray-700">{p.birthday}</td>
                <td className="py-2 px-4 text-gray-700 text-center">
                  <button>
                    <img src="/svgs/share.svg" alt="Share" className="w-4 h-4 object-contain mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

    </section>
  );
}
