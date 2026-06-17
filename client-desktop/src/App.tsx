import { useState, useEffect } from 'react'
import { login, signup, getCurrentUser, logout, getDashboardStats, getIncidents, getReleases, getTeams, createIncident, createRelease, createTeam, updateReleaseStep, cancelRelease, acknowledgeIncident, escalateIncident, resolveIncident, joinTeam } from './services/mockApi'

function Header({ currentPage, setCurrentPage, user }: { currentPage: string, setCurrentPage: (page: string) => void, user: any }) {
  const handleLogout = () => {
    logout()
    setCurrentPage('home')
  }

  return (
    <header className="bg-secondary border-b border-accent">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
          <img src="/logo.png" alt="VIGIL Logo" className="w-16 h-16 mr-2" />
          <span className="text-xl font-bold text-white">VIGIL Desktop</span>
        </div>
        <nav className="flex space-x-4">
          {user ? (
            <>
              <button onClick={() => setCurrentPage('dashboard')} className={`text-gray-300 hover:text-white transition ${currentPage === 'dashboard' ? 'text-white font-bold' : ''}`}>Dashboard</button>
              <button onClick={() => setCurrentPage('incidents')} className={`text-gray-300 hover:text-white transition ${currentPage === 'incidents' ? 'text-white font-bold' : ''}`}>Incidents</button>
              <button onClick={() => setCurrentPage('releases')} className={`text-gray-300 hover:text-white transition ${currentPage === 'releases' ? 'text-white font-bold' : ''}`}>Releases</button>
              <button onClick={() => setCurrentPage('teams')} className={`text-gray-300 hover:text-white transition ${currentPage === 'teams' ? 'text-white font-bold' : ''}`}>Teams</button>
              <button onClick={handleLogout} className="text-gray-300 hover:text-white transition">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentPage('login')} className={`text-gray-300 hover:text-white transition ${currentPage === 'login' ? 'text-white font-bold' : ''}`}>Login</button>
              <button onClick={() => setCurrentPage('signup')} className={`text-gray-300 hover:text-white transition ${currentPage === 'signup' ? 'text-white font-bold' : ''}`}>Sign Up</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function HomePage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <img src="/logo.png" alt="VIGIL Logo" className="w-32 h-32 mr-4" />
        <h1 className="text-4xl font-bold">VIGIL Desktop</h1>
      </div>
      <p className="text-center text-gray-300 text-xl mb-8">
        Operational Control Room - Desktop Client
      </p>
      <div className="mt-8 text-center">
        <p className="text-gray-400 mb-4">
          Native desktop application for VIGIL
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={() => setCurrentPage('login')} className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded transition">
            Login
          </button>
          <button onClick={() => setCurrentPage('dashboard')} className="bg-secondary hover:bg-secondary/80 text-white px-6 py-2 rounded transition">
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const [stats, setStats] = useState({ openIncidents: 0, activeReleases: 0, teamMembers: 0, criticalIssues: 0 })
  const [incidents, setIncidents] = useState<any[]>([])
  const [releases, setReleases] = useState<any[]>([])

  useEffect(() => {
    setStats(getDashboardStats())
    setIncidents(getIncidents().slice(0, 3))
    setReleases(getReleases().slice(0, 2))
  }, [])

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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
            <button className="bg-primary hover:bg-primary/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/50" accessKey="i">
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
            <button className="bg-primary hover:bg-primary/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/50" accessKey="r">
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
    </div>
  )
}

function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
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
    const user = getCurrentUser()

    // Get all teams the user is a member of
    const teams = getTeams()
    const userTeams = teams.filter((t: any) => t.members && t.members.includes(user?.email))
    const userTeamNames = userTeams.map((t: any) => t.name)

    // Filter incidents by team assignment
    const allIncidents = getIncidents()
    const filteredIncidents = allIncidents.filter((i: any) =>
      userTeamNames.includes(i.team) || i.team === 'General' || !i.team
    )
    setIncidents(filteredIncidents)
  }, [])

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault()
    const user = getCurrentUser()
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
      const user = getCurrentUser()
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Incidents</h1>
      <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4" accessKey="n">
        + New Incident (Ctrl+N)
      </button>
      {incidents.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">No incidents yet</p>
          <p className="text-gray-500 mt-2">Create your first incident to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{incident.title}</h3>
                <span className={`px-3 py-1 text-white text-sm rounded ${getSeverityColor(incident.severity)}`} title={`Severity: ${incident.severity}`}>
                  {getSeverityIcon(incident.severity)} {incident.severity}
                </span>
                <span className={`px-3 py-1 text-white text-sm rounded ${getStatusColor(incident.status)}`} title={`Status: ${incident.status}`}>
                  {getStatusIcon(incident.status)} {incident.status}
                </span>
              </div>
              <p className="text-gray-400">{incident.description}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleAcknowledge(incident.id)} className="bg-info hover:bg-info/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-info/50" accessKey="a" title="Acknowledge incident">
                  👁️ Acknowledge (Ctrl+A)
                </button>
                <button onClick={() => handleEscalate(incident.id)} className="bg-danger hover:bg-danger/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-danger/50" accessKey="e" title="Escalate incident">
                  ⬆️ Escalate (Ctrl+E)
                </button>
                <button onClick={() => handleResolve(incident.id)} className="bg-success hover:bg-success/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-success/50" title="Resolve incident">
                  ✅ Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Incident</h2>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label htmlFor="incident-title" className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  id="incident-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label htmlFor="incident-description" className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  id="incident-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="incident-severity" className="block text-sm font-medium mb-2">Severity</label>
                <select
                  id="incident-severity"
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
                <label htmlFor="incident-assignedTo" className="block text-sm font-medium mb-2">Assigned To</label>
                <input
                  type="text"
                  id="incident-assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label htmlFor="incident-team" className="block text-sm font-medium mb-2">Team</label>
                <input
                  type="text"
                  id="incident-team"
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

function ReleasesPage() {
  const [releases, setReleases] = useState<any[]>([])
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
    const user = getCurrentUser()

    // Get all teams the user is a member of
    const teams = getTeams()
    const userTeams = teams.filter((t: any) => t.members && t.members.includes(user?.email))
    const userTeamNames = userTeams.map((t: any) => t.name)

    // Filter releases by team assignment
    const allReleases = getReleases()
    const filteredReleases = allReleases.filter((r: any) =>
      userTeamNames.includes(r.team) || r.team === 'General' || !r.team
    )
    setReleases(filteredReleases)
  }, [])

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Releases</h1>
      <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4" accessKey="n">
        + New Release (Ctrl+N)
      </button>
      {releases.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">No releases yet</p>
          <p className="text-gray-500 mt-2">Create your first release to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {releases.map((release) => (
            <div key={release.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{release.version} - {release.description}</h3>
                <span className={`px-3 py-1 text-white text-sm rounded ${getStatusColor(release.status)}`} title={`Status: ${release.status}`}>
                  {getStatusIcon(release.status)} {release.status}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{release.description}</p>
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Progress: Step {release.currentStep}/{release.totalSteps}</p>
                <div className="w-full bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={release.currentStep} aria-valuemin={0} aria-valuemax={release.totalSteps}>
                  <div className={`${getProgressColor(release.status)} h-2 rounded-full`} style={{ width: `${(release.currentStep / release.totalSteps) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleValidateStep(release.id)} className="bg-success hover:bg-success/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-success/50" accessKey="v" title="Validate current step">
                  ✅ Validate Step (Ctrl+V)
                </button>
                <button onClick={() => handleCancelRelease(release.id)} className="bg-warning hover:bg-warning/80 text-white px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-warning/50" accessKey="c" title="Cancel release">
                  ❌ Cancel (Ctrl+C)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Release</h2>
            <form onSubmit={handleCreateRelease} className="space-y-4">
              <div>
                <label htmlFor="release-version" className="block text-sm font-medium mb-2">Version</label>
                <input
                  type="text"
                  id="release-version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. v1.0.0"
                  required
                />
              </div>
              <div>
                <label htmlFor="release-description" className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  id="release-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="release-team" className="block text-sm font-medium mb-2">Team</label>
                <input
                  type="text"
                  id="release-team"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label htmlFor="release-totalSteps" className="block text-sm font-medium mb-2">Total Steps</label>
                <input
                  type="number"
                  id="release-totalSteps"
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

function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberCount: 1,
  })

  useEffect(() => {
    setTeams(getTeams())
  }, [])

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    const user = getCurrentUser()
    const newTeam = createTeam({
      name: formData.name,
      description: formData.description,
      memberCount: formData.memberCount,
      leader: '',
      members: [],
    }, user?.email || '')
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
    const user = getCurrentUser()
    if (user) {
      const result = joinTeam(teamId, user.email)
      if (result.success && result.team) {
        setTeams(teams.map(t => t.id === teamId ? result.team : t))
      } else if (result.error) {
        alert(result.error)
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4" accessKey="n">
        + Create Team (Ctrl+N)
      </button>
      {teams.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">No teams yet</p>
          <p className="text-gray-500 mt-2">Create your first team to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
              <p className="text-gray-400 mb-2">{team.description}</p>
              <span className={`px-3 py-1 text-white text-sm rounded ${getMemberCountColor(team.memberCount)}`} title={`${team.memberCount} members`}>
                {getMemberCountIcon(team.memberCount)} {team.memberCount} members
              </span>
              <div className="mt-4">
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
              <div className="mt-4">
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

function LoginPage({ setCurrentPage, onLogin }: { setCurrentPage: (page: string) => void, onLogin: () => void }) {
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
      onLogin()
      setCurrentPage('dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        {error && (
          <div className="mb-4 p-3 bg-danger/20 border border-danger rounded text-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" placeholder="your@email.com" required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50" accessKey="l">
            {loading ? 'Logging in...' : 'Login (Ctrl+L)'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account? <button onClick={() => setCurrentPage('signup')} className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">Sign up</button>
        </p>
      </div>
    </div>
  )
}

function SignupPage({ setCurrentPage, onLogin }: { setCurrentPage: (page: string) => void, onLogin: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const result = await signup(name, email, password)
    
    if (result.success) {
      onLogin()
      setCurrentPage('dashboard')
    } else {
      setError(result.error || 'Signup failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
        {error && (
          <div className="mb-4 p-3 bg-danger/20 border border-danger rounded text-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Full name</label>
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" placeholder="John Doe" required autoComplete="name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" placeholder="your@email.com" required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" placeholder="••••••••" required autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" placeholder="••••••••" required autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50" accessKey="s">
            {loading ? 'Creating account...' : 'Sign Up (Ctrl+S)'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account? <button onClick={() => setCurrentPage('login')} className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">Login</button>
        </p>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogin = () => {
    setUser(getCurrentUser())
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />
      case 'dashboard':
        return <DashboardPage />
      case 'incidents':
        return <IncidentsPage />
      case 'releases':
        return <ReleasesPage />
      case 'teams':
        return <TeamsPage />
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />
      default:
        return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />
      {renderPage()}
    </div>
  )
}

export default App