'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getTeams, getCurrentUser, logout, createTeam, joinTeam } from '@/services/mockApi'
import { useRouter } from 'next/navigation'

export default function Teams() {
  const router = useRouter()
  const [teams, setTeams] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberCount: 1,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    setTeams(getTeams())
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    const newTeam = createTeam({
      name: formData.name,
      description: formData.description,
      memberCount: formData.memberCount,
    })
    setTeams([...teams, newTeam])
    setShowModal(false)
    setFormData({
      name: '',
      description: '',
      memberCount: 1,
    })
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const handleJoinTeam = (teamId: string) => {
    if (user) {
      const updatedTeam = joinTeam(teamId, user.email)
      if (updatedTeam) {
        setTeams(teams.map(t => t.id === teamId ? updatedTeam : t))
      }
    }
  }

  const getMemberCountColor = (count: number) => {
    if (count >= 8) return 'bg-success'
    if (count >= 5) return 'bg-info'
    if (count >= 3) return 'bg-warning'
    return 'bg-gray-600'
  }

  const getMemberCountIcon = (count: number) => {
    if (count >= 8) return '👥'
    if (count >= 5) return '👤'
    if (count >= 3) return '🧑'
    return '👤'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Teams</h1>
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
              + Create Team (Ctrl+N)
            </button>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No teams yet</p>
            <p className="text-gray-500 mt-2">Create your first team to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <p className="text-gray-400 text-sm">{team.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-white text-sm rounded ${getMemberCountColor(team.memberCount)}`} title={`${team.memberCount} members`}>
                    {getMemberCountIcon(team.memberCount)} {team.memberCount} members
                  </span>
                </div>
                <div className="mb-4">
                  <label htmlFor={`code-${team.id}`} className="text-sm text-gray-400 mb-2 block">
                    Invitation Code:
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      id={`code-${team.id}`}
                      readOnly 
                      value={team.invitationCode}
                      className="font-mono bg-gray-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => handleCopyCode(team.invitationCode)}
                      className="bg-secondary hover:bg-secondary/80 text-white px-2 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      accessKey="c"
                      title="Copy invitation code"
                    >
                      📋 Copy (Ctrl+C)
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm" title={`${team.memberCount} members`}>
                      {getMemberCountIcon(team.memberCount)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinTeam(team.id)}
                    className="bg-success hover:bg-success/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-success/50"
                    title="Join this team"
                  >
                    Join Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label htmlFor="team-name" className="block text-sm font-medium mb-2">Team Name</label>
                <input
                  type="text"
                  id="team-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label htmlFor="team-description" className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  id="team-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="team-memberCount" className="block text-sm font-medium mb-2">Initial Member Count</label>
                <input
                  type="number"
                  id="team-memberCount"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 1 })}
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
                  Create Team
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
    </div>
  )
}
