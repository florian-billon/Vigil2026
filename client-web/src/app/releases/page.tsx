'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getReleases, getCurrentUser, logout, createRelease, updateReleaseStep, cancelRelease, getTeams } from '@/services/mockApi'
import { useRouter } from 'next/navigation'

export default function Releases() {
  const router = useRouter()
  const [releases, setReleases] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [releaseToCancel, setReleaseToCancel] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    version: '',
    description: '',
    team: '',
    totalSteps: 5,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)

    // Get all teams the user is a member of
    const teams = getTeams()
    const userTeams = teams.filter((t: any) => t.members.includes(currentUser.email))
    const userTeamNames = userTeams.map((t: any) => t.name)

    // Filter releases by team assignment
    const allReleases = getReleases()
    const filteredReleases = allReleases.filter((r: any) =>
      userTeamNames.includes(r.team) || r.team === 'General'
    )
    setReleases(filteredReleases)
  }, [router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault()
            setShowModal(true)
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
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault()
    const newRelease = createRelease({
      version: formData.version,
      description: formData.description,
      team: formData.team || 'General',
      totalSteps: formData.totalSteps,
    })
    setReleases([...releases, newRelease])
    setShowModal(false)
    setFormData({
      version: '',
      description: '',
      team: '',
      totalSteps: 5,
    })
  }

  const handleValidateStep = (releaseId: string) => {
    const updatedRelease = updateReleaseStep(releaseId)
    if (updatedRelease) {
      setReleases(releases.map(r => r.id === releaseId ? updatedRelease : r))
    }
  }

  const handleCancelRelease = (releaseId: string) => {
    setReleaseToCancel(releaseId)
    setShowCancelDialog(true)
  }

  const confirmCancelRelease = () => {
    if (releaseToCancel) {
      const updatedRelease = cancelRelease(releaseToCancel)
      if (updatedRelease) {
        setReleases(releases.map(r => r.id === releaseToCancel ? updatedRelease : r))
      }
      setShowCancelDialog(false)
      setReleaseToCancel(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case 'created': return '🆕'
      case 'in_progress': return '🔄'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
      case 'blocked': return '🚫'
      default: return '❓'
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success'
      case 'in_progress': return 'bg-primary'
      default: return 'bg-primary'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Releases</h1>
          <div className="flex gap-4">
            {user && (
              <button 
                onClick={handleLogout} 
                className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
                accessKey="o"
              >
                Logout (Ctrl+O)
              </button>
            )}
            <button 
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-primary/50"
              accessKey="n"
            >
              + New Release (Ctrl+N)
            </button>
          </div>
        </div>

        {releases.length === 0 ? (
          <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No releases yet</p>
            <p className="text-gray-500 mt-2">Create your first release to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {releases.map((release) => (
              <div key={release.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{release.version} - {release.description}</h3>
                      <span className={`px-3 py-1 text-white text-sm rounded ${getStatusColor(release.status)}`} title={`Status: ${release.status}`}>
                        {getStatusIcon(release.status)} {release.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      {release.description}
                    </p>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Progress: Step {release.currentStep}/{release.totalSteps}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={release.currentStep} aria-valuemin={0} aria-valuemax={release.totalSteps}>
                        <div className={`${getProgressColor(release.status)} h-2 rounded-full`} style={{ width: `${(release.currentStep / release.totalSteps) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Created: {new Date(release.createdAt).toLocaleString()}</span>
                      <span>Team: {release.team}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleValidateStep(release.id)}
                        className="bg-success hover:bg-success/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-success/50"
                        accessKey="v"
                        title="Validate current step"
                      >
                        ✅ Validate Step (Ctrl+V)
                      </button>
                      <button
                        onClick={() => handleCancelRelease(release.id)}
                        className="bg-warning hover:bg-warning/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-warning/50"
                        accessKey="c"
                        title="Cancel release"
                      >
                        ❌ Cancel (Ctrl+C)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Release</h2>
            <form onSubmit={handleCreateRelease} className="space-y-4">
              <div>
                <label htmlFor="version" className="block text-sm font-medium mb-2">Version</label>
                <input
                  type="text"
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. v1.0.0"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="team" className="block text-sm font-medium mb-2">Team</label>
                <input
                  type="text"
                  id="team"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label htmlFor="totalSteps" className="block text-sm font-medium mb-2">Total Steps</label>
                <input
                  type="number"
                  id="totalSteps"
                  value={formData.totalSteps}
                  onChange={(e) => setFormData({ ...formData, totalSteps: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  min="1"
                  required
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/80 text-white py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Create Release
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-white py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-danger">Confirm Cancel Release</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this release? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmCancelRelease}
                className="flex-1 bg-danger hover:bg-danger/80 text-white py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-danger/50"
              >
                Yes, Cancel Release
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false)
                  setReleaseToCancel(null)
                }}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-white py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                No, Keep Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
