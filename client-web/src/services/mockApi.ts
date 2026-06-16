// Mock API service for demonstration purposes
// Uses localStorage to simulate backend functionality

interface User {
  id: string
  name: string
  email: string
  password: string
}

interface Incident {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'acknowledged' | 'escalated' | 'resolved'
  createdAt: string
  assignedTo: string
  team: string
}

interface Release {
  id: string
  version: string
  description: string
  status: 'created' | 'in_progress' | 'completed' | 'cancelled' | 'blocked'
  currentStep: number
  totalSteps: number
  createdAt: string
  team: string
}

interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  invitationCode: string
}

// Mock data storage
const STORAGE_KEYS = {
  USERS: 'vigil_users',
  CURRENT_USER: 'vigil_current_user',
  INCIDENTS: 'vigil_incidents',
  RELEASES: 'vigil_releases',
  TEAMS: 'vigil_teams',
}

// Initialize mock data
export function initializeMockData() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.RELEASES)) {
    localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify([]))
  }
}

// Auth functions
export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  initializeMockData()
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  const user = users.find((u: User) => u.email === email && u.password === password)
  
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    return { success: true, user }
  }
  
  return { success: false, error: 'Invalid email or password' }
}

export async function signup(name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  initializeMockData()
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  
  if (users.find((u: User) => u.email === email)) {
    return { success: false, error: 'Email already exists' }
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
  }
  
  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser))
  
  return { success: true, user: newUser }
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return userStr ? JSON.parse(userStr) : null
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

// Data functions
export function getIncidents(): Incident[] {
  initializeMockData()
  const incidents = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]')
  
  // Return empty array if no data, or the stored data
  return incidents
}

export function getReleases(): Release[] {
  initializeMockData()
  const releases = JSON.parse(localStorage.getItem(STORAGE_KEYS.RELEASES) || '[]')
  return releases
}

export function getTeams(): Team[] {
  initializeMockData()
  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]')
  return teams
}

export function getDashboardStats() {
  const incidents = getIncidents()
  const releases = getReleases()
  const teams = getTeams()
  
  return {
    openIncidents: incidents.filter(i => i.status === 'open').length,
    activeReleases: releases.filter(r => r.status === 'in_progress').length,
    teamMembers: teams.reduce((sum, t) => sum + t.memberCount, 0),
    criticalIssues: incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length,
  }
}

export function createIncident(incident: Omit<Incident, 'id' | 'createdAt'>): Incident {
  initializeMockData()
  const incidents = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]')
  
  const newIncident: Incident = {
    ...incident,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  
  incidents.push(newIncident)
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents))
  
  return newIncident
}

export function createRelease(release: Omit<Release, 'id' | 'createdAt' | 'currentStep' | 'status'>): Release {
  initializeMockData()
  const releases = JSON.parse(localStorage.getItem(STORAGE_KEYS.RELEASES) || '[]')
  
  const newRelease: Release = {
    ...release,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    currentStep: 1,
    status: 'created',
  }
  
  releases.push(newRelease)
  localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(releases))
  
  return newRelease
}

export function createTeam(team: Omit<Team, 'id' | 'invitationCode'>): Team {
  initializeMockData()
  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]')

  const newTeam: Team = {
    ...team,
    id: Date.now().toString(),
    invitationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
  }

  teams.push(newTeam)
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams))

  return newTeam
}

export function updateReleaseStep(releaseId: string): Release | null {
  initializeMockData()
  const releases = JSON.parse(localStorage.getItem(STORAGE_KEYS.RELEASES) || '[]')
  const releaseIndex = releases.findIndex((r: Release) => r.id === releaseId)

  if (releaseIndex === -1) return null

  const release = releases[releaseIndex]
  if (release.currentStep < release.totalSteps) {
    release.currentStep += 1
    release.status = 'in_progress'
  } else {
    release.status = 'completed'
  }

  releases[releaseIndex] = release
  localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(releases))

  return release
}

export function cancelRelease(releaseId: string): Release | null {
  initializeMockData()
  const releases = JSON.parse(localStorage.getItem(STORAGE_KEYS.RELEASES) || '[]')
  const releaseIndex = releases.findIndex((r: Release) => r.id === releaseId)

  if (releaseIndex === -1) return null

  const release = releases[releaseIndex]
  release.status = 'cancelled'

  releases[releaseIndex] = release
  localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(releases))

  return release
}

export function acknowledgeIncident(incidentId: string): Incident | null {
  initializeMockData()
  const incidents = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]')
  const incidentIndex = incidents.findIndex((i: Incident) => i.id === incidentId)

  if (incidentIndex === -1) return null

  const incident = incidents[incidentIndex]
  incident.status = 'acknowledged'

  incidents[incidentIndex] = incident
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents))

  return incident
}

export function escalateIncident(incidentId: string): Incident | null {
  initializeMockData()
  const incidents = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]')
  const incidentIndex = incidents.findIndex((i: Incident) => i.id === incidentId)

  if (incidentIndex === -1) return null

  const incident = incidents[incidentIndex]
  incident.status = 'escalated'

  incidents[incidentIndex] = incident
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents))

  return incident
}

export function resolveIncident(incidentId: string): Incident | null {
  initializeMockData()
  const incidents = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]')
  const incidentIndex = incidents.findIndex((i: Incident) => i.id === incidentId)

  if (incidentIndex === -1) return null

  const incident = incidents[incidentIndex]
  incident.status = 'resolved'

  incidents[incidentIndex] = incident
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents))

  return incident
}

export function joinTeam(teamId: string, userId: string): Team | null {
  initializeMockData()
  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]')
  const teamIndex = teams.findIndex((t: Team) => t.id === teamId)

  if (teamIndex === -1) return null

  const team = teams[teamIndex]
  team.memberCount += 1

  teams[teamIndex] = team
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams))

  return team
}
