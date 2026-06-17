'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getIncidents, getCurrentUser, logout, createIncident, acknowledgeIncident, escalateIncident, resolveIncident, getIncidentsForTeam, getTeams } from '@/services/mockApi'
import { useRouter } from 'next/navigation'

export default function Incidents() {
  const router = useRouter()
  const [incidents, setIncidents] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showEscalateDialog, setShowEscalateDialog] = useState(false)
  const [incidentToEscalate, setIncidentToEscalate] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    assignedTo: '',
    team: '',
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

    // Filter incidents by team assignment
    const allIncidents = getIncidents()
    const filteredIncidents = allIncidents.filter((i: any) =>
      userTeamNames.includes(i.team) || i.team === 'General'
    )
    setIncidents(filteredIncidents)
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

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault()
    const newIncident = createIncident({
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      status: 'open',
      assignedTo: formData.assignedTo || user?.name || 'Unassigned',
      team: formData.team || 'General',
    })
    setIncidents([...incidents, newIncident])
    setShowModal(false)
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      assignedTo: '',
      team: '',
    })
  }

  const handleAcknowledge = (incidentId: string) => {
    const updatedIncident = acknowledgeIncident(incidentId)
    if (updatedIncident) {
      setIncidents(incidents.map(i => i.id === incidentId ? updatedIncident : i))
    }
  }

  const handleEscalate = (incidentId: string) => {
    setIncidentToEscalate(incidentId)
    setShowEscalateDialog(true)
  }

  const confirmEscalate = () => {
    if (incidentToEscalate) {
      const updatedIncident = escalateIncident(incidentToEscalate, user?.email || '')
      if (updatedIncident) {
        setIncidents(incidents.map(i => i.id === incidentToEscalate ? updatedIncident : i))
      }
      setShowEscalateDialog(false)
      setIncidentToEscalate(null)
    }
  }

  const handleResolve = (incidentId: string) => {
    const updatedIncident = resolveIncident(incidentId)
    if (updatedIncident) {
      setIncidents(incidents.map(i => i.id === incidentId ? updatedIncident : i))
    }
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
      default: return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return '📋'
      case 'acknowledged': return '👁️'
      case 'escalated': return '⬆️'
      case 'resolved': return '✅'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Incidents</h1>
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
              + New Incident (Ctrl+N)
            </button>
          </div>
        </div>

        {incidents.length === 0 ? (
          <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No incidents yet</p>
            <p className="text-gray-500 mt-2">Create your first incident to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{incident.title}</h3>
                      <span className={`px-3 py-1 text-white text-sm rounded ${getSeverityColor(incident.severity)}`} title={`Severity: ${incident.severity}`}>
                        {getSeverityIcon(incident.severity)} {incident.severity}
                      </span>
                      <span className={`px-3 py-1 text-white text-sm rounded ${getStatusColor(incident.status)}`} title={`Status: ${incident.status}`}>
                        {getStatusIcon(incident.status)} {incident.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Created: {new Date(incident.createdAt).toLocaleString()}</span>
                      <span>Assigned: {incident.assignedTo}</span>
                      <span>Team: {incident.team}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAcknowledge(incident.id)}
                        className="bg-info hover:bg-info/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-info/50"
                        accessKey="a"
                        title="Acknowledge incident"
                      >
                        👁️ Acknowledge (Ctrl+A)
                      </button>
                      <button
                        onClick={() => handleEscalate(incident.id)}
                        className="bg-danger hover:bg-danger/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-danger/50"
                        accessKey="e"
                        title="Escalate incident"
                      >
                        ⬆️ Escalate (Ctrl+E)
                      </button>
                      <button
                        onClick={() => handleResolve(incident.id)}
                        className="bg-success hover:bg-success/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-success/50"
                        title="Resolve incident"
                      >
                        ✅ Resolve
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
            <h2 className="text-2xl font-bold mb-4">Create New Incident</h2>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
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
                <label htmlFor="severity" className="block text-sm font-medium mb-2">Severity</label>
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium mb-2">Assigned To</label>
                <input
                  type="text"
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
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
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/80 text-white py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Create Incident
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

      {showEscalateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-danger">Confirm Escalate Incident</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to escalate this incident? This action will notify higher-level support teams.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmEscalate}
                className="flex-1 bg-danger hover:bg-danger/80 text-white py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-danger/50"
              >
                Yes, Escalate Incident
              </button>
              <button
                onClick={() => {
                  setShowEscalateDialog(false)
                  setIncidentToEscalate(null)
                }}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-white py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                No, Keep as Is
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
