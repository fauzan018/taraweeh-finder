"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { name: "Dashboard", href: "/admin" },
  { name: "Approved Masjids", href: "/admin/approved" },
  { name: "Pending Submissions", href: "/admin/pending" },
  { name: "Add New Masjid", href: "/admin/add" },
  { name: "Analytics", href: "/admin/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-[var(--surface)] p-6 flex flex-col gap-4 shadow-xl rounded-r-xl">
      <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-4 py-2 text-white font-medium transition-all ${pathname === item.href ? "bg-[var(--primary)] text-black shadow-glow" : "hover:bg-[var(--card)]"}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
