"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, X } from "lucide-react";

interface MenuItem {
    key: string;
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface SidebarProps {
    menuItems?: MenuItem[];
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({
    menuItems = [
        { key: "dashboard", label: "Dashboard", href: "/" },
        { key: "users", label: "Tabel Users", href: "/users" },
        { key: "sprite", label: "Sprite Image", href: "/sprite" },
        { key: "analytics", label: "Analytic Dashboard", href: "/analytic-dashboard" },
        { key: "map", label: "Penanganan Map", href: "/penanganan-map" },
        { key: "web-storage", label: "Web Storage", href: "/web-storage" },
        { key: "indexdb", label: "IndexDB", href: "/indexdb" },
        { key: "realtime-db", label: "Realtime DB", href: "/realtime-db" },
    ],
    className = "",
    isOpen = true,
    onClose,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                    ${className}
                `}
            >
                <div className="h-full overflow-y-auto py-6">
                    <div className="lg:hidden flex justify-end px-4 mb-4">
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition p-2"
                            aria-label="Close Sidebar"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="px-3">
                        <div className="mb-4">
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Navigation
                            </h3>
                        </div>
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                const content = (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="flex-1">{item.label}</span>
                                        {item.href && (
                                            <ChevronRight
                                                size={16}
                                                className="opacity-0 group-hover:opacity-100"
                                            />
                                        )}
                                    </div>
                                );

                                const itemClassName = `
                                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition
                                    ${isActive
                                        ? "bg-blue-100 text-blue-700 font-semibold"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                    }
                                `;

                                return (
                                    <li key={item.key}>
                                        <Link
                                            href={item.href!}
                                            className={itemClassName}
                                        >
                                            {content}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}