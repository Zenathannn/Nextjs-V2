import { ReactNode } from "react";

interface StatCardProps {
  title?: string;
  children?: ReactNode;
  fullWidth?: boolean;
  clasname?: string;
}

export default function StatCard({
  title,
  children,
  fullWidth = false,
  clasname = ""
}: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded shadow ${fullWidth ? "w-full" : "w-auto"}`}>
      {title && <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}