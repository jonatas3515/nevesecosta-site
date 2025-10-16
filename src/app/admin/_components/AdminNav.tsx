"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const baseLinks = [
  { href: "/admin/dashboard", label: "Dashboard", key: "dashboard" },
  { href: "/admin/pedidos", label: "Pedidos", key: "can_orders" },
  { href: "/admin/posts", label: "Posts", key: "can_posts" },
  { href: "/admin/categorias", label: "Categorias", key: "can_posts" },
  { href: "/admin/comentarios", label: "Comentários", key: "can_posts" },
  { href: "/admin/produtos", label: "Produtos", key: "can_products" },
  { href: "/admin/avaliacoes", label: "Avaliações", key: "can_reviews" },
  { href: "/admin/usuarios", label: "Usuários", key: "is_admin" },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<{ is_admin?: boolean; can_posts?: boolean; can_reviews?: boolean; can_orders?: boolean; can_products?: boolean } | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id;
      if (!uid) { setAllowed({}); return }
      let is_admin = false
      try {
        const { data: prof } = await supabase.from('profiles').select('role').eq('id', uid).single();
        is_admin = prof?.role === 'admin'
      } catch {}
      try {
        const { data: perms } = await supabase.from('admin_permissions').select('*').eq('user_id', uid).maybeSingle();
        setAllowed({
          is_admin,
          can_posts: is_admin || !!perms?.can_posts,
          can_reviews: is_admin || !!perms?.can_reviews,
          can_orders: is_admin || !!perms?.can_orders,
          can_products: is_admin || !!perms?.can_products,
        })
      } catch {
        setAllowed({ is_admin })
      }
    }
    load()
  }, [])

  return (
    <nav className="mb-6 border-b border-gold-500/30 pb-4">
      <ul className="flex items-center gap-2 px-2 flex-wrap">
        {(allowed ? baseLinks.filter(l => l.key === 'dashboard' || (allowed as any)[l.key]) : baseLinks).map((l) => {
          const active = pathname === l.href
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? 'bg-gold-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-gold-500'
                }`}
              >
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  );
}
