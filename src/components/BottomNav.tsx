"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/", label: "Home" },
  { href: "/calendario", label: "Calendario" },
  { href: "/analytics", label: "Analytics" },
  { href: "/fun", label: "Fun" },
  { href: "/admin", label: "Admin" },
];
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a3a6b] border-t-2 border-[#f5c518] flex max-w-md mx-auto z-50">
      {links.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href}
            className={`flex-1 flex flex-col items-center py-3 text-[10px] transition-colors ${active ? "text-[#f5c518]" : "text-white/60"}`}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
