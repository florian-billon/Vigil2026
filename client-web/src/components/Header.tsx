import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-secondary border-b border-accent">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="VIGIL Logo" className="w-16 h-16 mr-2" />
            <span className="text-xl font-bold text-white">VIGIL</span>
          </Link>
        </div>
        <nav className="flex space-x-4">
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
          <Link href="/incidents" className="text-gray-300 hover:text-white transition">Incidents</Link>
          <Link href="/releases" className="text-gray-300 hover:text-white transition">Releases</Link>
          <Link href="/teams" className="text-gray-300 hover:text-white transition">Teams</Link>
          <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link href="/signup" className="text-gray-300 hover:text-white transition">Sign Up</Link>
        </nav>
      </div>
    </header>
  )
}
