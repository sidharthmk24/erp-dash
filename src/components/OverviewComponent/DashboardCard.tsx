import React from "react";

export type DashboardCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: "up" | "down" | "flat";
    value: string;
  };
  icon?: React.ReactNode;
  accent?: string; // Tailwind color e.g. "red"
  className?: string;
};

export default function DashboardCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  accent = "red",
  className,
}: DashboardCardProps) {
  // Use static classes for reliability with Tailwind's purge
  const ringClass = "ring-1 ring-red-200";
  const dotClass = "bg-red-500";
  const textAccent = "text-red-600";

  return (
    <div
      className={[
        "relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200",
        className || "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 tracking-wide">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
          {subtitle && (
            <p className="text-[11px] text-gray-500 leading-5">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={[
              "flex h-10 w-10 items-center justify-center rounded-full",
              ringClass,
            ].join(" ")}
          >
            <div className={["h-2 w-2 rounded-full", dotClass].join(" ")} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span
            className={[
              "inline-flex items-center rounded-full px-2 py-0.5 font-medium",
              trend.direction === "up" && "bg-green-50 text-green-700",
              trend.direction === "down" && "bg-red-50 text-red-700",
              trend.direction === "flat" && "bg-gray-50 text-gray-600",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {trend.value}
          </span>
          <span className={["text-gray-500", textAccent].join(" ")}>
            {trend.direction === "up" && "▲"}
            {trend.direction === "down" && "▼"}
            {trend.direction === "flat" && "—"}
          </span>
        </div>
      )}
    </div>
  );
}

