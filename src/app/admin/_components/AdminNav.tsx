"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/novo", label: "Novo Post" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/comentarios", label: "Comentários" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 -mx-2 overflow-x-auto">
      <ul className="flex items-center gap-2 px-2">
        {links.map((l) => {
          const active = pathname?.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm border transition-colors ${
                  active ? "bg-primary-600 text-white border-primary-600" : "bg-white hover:bg-gray-50"
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
