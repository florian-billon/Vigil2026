'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { login } from '@/services/mockApi'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          {error && (
            <div className="mb-4 p-3 bg-danger/20 border border-danger rounded text-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              accessKey="l"
            >
              {loading ? 'Logging in...' : 'Login (Ctrl+L)'}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-400">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
