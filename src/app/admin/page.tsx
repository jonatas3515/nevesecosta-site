import Link from 'next/link'

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700">Bem-vindo à área administrativa. Escolha uma seção:</p>
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/admin/dashboard" className="block p-4 border rounded-lg hover:bg-gray-50">Dashboard</Link>
        <Link href="/admin/pedidos" className="block p-4 border rounded-lg hover:bg-gray-50">Pedidos</Link>
        <Link href="/admin/categorias" className="block p-4 border rounded-lg hover:bg-gray-50">Categorias</Link>
        <Link href="/admin/posts/novo" className="block p-4 border rounded-lg hover:bg-gray-50">Novo Post</Link>
        <Link href="/admin/comentarios" className="block p-4 border rounded-lg hover:bg-gray-50">Comentários</Link>
      </div>
    </div>
  )
}
