'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getDashboardStats, getIncidents, getReleases, getCurrentUser, logout } from '@/services/mockApi'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ openIncidents: 0, activeReleases: 0, teamMembers: 0, criticalIssues: 0 })
  const [incidents, setIncidents] = useState<any[]>([])
  const [releases, setReleases] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)

    // Load data from mock API
    setStats(getDashboardStats())
    setIncidents(getIncidents().slice(0, 3))
    setReleases(getReleases().slice(0, 2))
  }, [router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'i':
            e.preventDefault()
            router.push('/incidents')
            break
          case 'r':
            e.preventDefault()
            router.push('/releases')
            break
          case 'o':
            e.preventDefault()
            handleLogout()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger'
      case 'high': return 'bg-warning'
      case 'medium': return 'bg-info'
      case 'low': return 'bg-success'
      default: return 'bg-gray-600'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴'
      case 'high': return '🟠'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-warning'
      case 'acknowledged': return 'bg-info'
      case 'escalated': return 'bg-danger'
      case 'resolved': return 'bg-success'
      case 'created': return 'bg-success'
      case 'in_progress': return 'bg-info'
      case 'completed': return 'bg-success'
      case 'cancelled': return 'bg-gray-600'
      case 'blocked': return 'bg-danger'
      default: return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return '📋'
      case 'acknowledged': return '👁️'
      case 'escalated': return '⬆️'
      case 'resolved': return '✅'
      case 'created': return '🆕'
      case 'in_progress': return '🔄'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
      case 'blocked': return '🚫'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Welcome, {user.name}</span>
              <button 
                onClick={handleLogout} 
                className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
                accessKey="o"
              >
                Logout (Ctrl+O)
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Open Incidents</h3>
            <p className="text-4xl font-bold text-warning">{stats.openIncidents}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Active Releases</h3>
            <p className="text-4xl font-bold text-info">{stats.activeReleases}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Team Members</h3>
            <p className="text-4xl font-bold text-success">{stats.teamMembers}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Critical Issues</h3>
            <p className="text-4xl font-bold text-danger">{stats.criticalIssues}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Incidents</h2>
              <button
                onClick={() => router.push('/incidents')}
                className="bg-primary hover:bg-primary/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                accessKey="i"
              >
                + New (Ctrl+I)
              </button>
            </div>
            {incidents.length === 0 ? (
              <p className="text-gray-400">No incidents yet. Create your first incident!</p>
            ) : (
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div>
                      <p className="font-medium">{incident.title}</p>
                      <p className="text-sm text-gray-400">{new Date(incident.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 text-white text-sm rounded ${getSeverityColor(incident.severity)}`} title={`Severity: ${incident.severity}`}>
                        {getSeverityIcon(incident.severity)} {incident.severity}
                      </span>
                      <span className={`px-3 py-1 text-white text-sm rounded ${getStatusColor(incident.status)}`} title={`Status: ${incident.status}`}>
                        {getStatusIcon(incident.status)} {incident.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Active Releases</h2>
              <button
                onClick={() => router.push('/releases')}
                className="bg-primary hover:bg-primary/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                accessKey="r"
              >
                + New (Ctrl+R)
              </button>
            </div>
            {releases.length === 0 ? (
              <p className="text-gray-400">No releases yet. Create your first release!</p>
            ) : (
              <div className="space-y-3">
                {releases.map((release) => (
                  <div key={release.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div>
                      <p className="font-medium">{release.version} - {release.description}</p>
                      <p className="text-sm text-gray-400">Step {release.currentStep}/{release.totalSteps}</p>
                    </div>
                    <span className={`px-3 py-1 text-white text-sm rounded ${getStatusColor(release.status)}`} title={`Status: ${release.status}`}>
                      {getStatusIcon(release.status)} {release.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
