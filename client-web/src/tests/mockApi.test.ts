import { describe, it, expect, beforeEach } from 'vitest'
import {
  login,
  signup,
  getCurrentUser,
  logout,
  getIncidents,
  createIncident,
  acknowledgeIncident,
  escalateIncident,
  resolveIncident,
  getReleases,
  createRelease,
  updateReleaseStep,
  cancelRelease,
  getTeams,
  createTeam,
  joinTeam,
  getNotificationsForUser,
  addNotification,
} from '@/services/mockApi'

describe('Authentication', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const result = await signup('Test User', 'test@example.com', 'password123')
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user?.email).toBe('test@example.com')
      expect(result.user?.name).toBe('Test User')
    })

    it('should not create duplicate user', async () => {
      await signup('Test User', 'test@example.com', 'password123')
      const result = await signup('Test User', 'test@example.com', 'password123')
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('login', () => {
    it('should login with correct credentials', async () => {
      await signup('Test User', 'test@example.com', 'password123')
      const result = await login('test@example.com', 'password123')
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
    })

    it('should fail with wrong password', async () => {
      await signup('Test User', 'test@example.com', 'password123')
      const result = await login('test@example.com', 'wrongpassword')
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should fail with non-existent user', async () => {
      const result = await login('nonexistent@example.com', 'password123')
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('getCurrentUser', () => {
    it('should return current logged in user', async () => {
      await signup('Test User', 'test@example.com', 'password123')
      await login('test@example.com', 'password123')
      const user = getCurrentUser()
      expect(user).toBeDefined()
      expect(user?.email).toBe('test@example.com')
    })

    it('should return null when no user logged in', () => {
      const user = getCurrentUser()
      expect(user).toBeNull()
    })
  })

  describe('logout', () => {
    it('should logout current user', async () => {
      await signup('Test User', 'test@example.com', 'password123')
      await login('test@example.com', 'password123')
      logout()
      const user = getCurrentUser()
      expect(user).toBeNull()
    })
  })
})

describe('Incidents', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createIncident', () => {
    it('should create a new incident', () => {
      const incident = createIncident({
        title: 'Test Incident',
        description: 'Test description',
        severity: 'high',
        status: 'open',
        assignedTo: 'John Doe',
        team: 'General',
      })
      expect(incident).toBeDefined()
      expect(incident.title).toBe('Test Incident')
      expect(incident.severity).toBe('high')
      expect(incident.status).toBe('open')
    })

    it('should generate unique ID for each incident', async () => {
      const incident1 = createIncident({
        title: 'Incident 1',
        description: 'Description 1',
        severity: 'low',
        status: 'open',
        assignedTo: 'User 1',
        team: 'General',
      })
      await new Promise(resolve => setTimeout(resolve, 1))
      const incident2 = createIncident({
        title: 'Incident 2',
        description: 'Description 2',
        severity: 'medium',
        status: 'open',
        assignedTo: 'User 2',
        team: 'General',
      })
      expect(incident1.id).not.toBe(incident2.id)
    })
  })

  describe('getIncidents', () => {
    it('should return all incidents', () => {
      createIncident({
        title: 'Incident 1',
        description: 'Description 1',
        severity: 'low',
        status: 'open',
        assignedTo: 'User 1',
        team: 'General',
      })
      createIncident({
        title: 'Incident 2',
        description: 'Description 2',
        severity: 'medium',
        status: 'open',
        assignedTo: 'User 2',
        team: 'General',
      })
      const incidents = getIncidents()
      expect(incidents.length).toBe(2)
    })

    it('should return empty array when no incidents', () => {
      const incidents = getIncidents()
      expect(incidents).toEqual([])
    })
  })

  describe('acknowledgeIncident', () => {
    it('should acknowledge an incident', () => {
      const incident = createIncident({
        title: 'Test Incident',
        description: 'Test description',
        severity: 'high',
        status: 'open',
        assignedTo: 'John Doe',
        team: 'General',
      })
      const updated = acknowledgeIncident(incident.id)
      expect(updated?.status).toBe('acknowledged')
    })

    it('should return null for non-existent incident', () => {
      const updated = acknowledgeIncident('non-existent-id')
      expect(updated).toBeNull()
    })
  })

  describe('escalateIncident', () => {
    it('should escalate an incident', () => {
      const incident = createIncident({
        title: 'Test Incident',
        description: 'Test description',
        severity: 'high',
        status: 'acknowledged',
        assignedTo: 'John Doe',
        team: 'General',
      })
      const updated = escalateIncident(incident.id, 'user@example.com')
      expect(updated?.status).toBe('escalated')
    })

    it('should notify team leader when incident is escalated', () => {
      const team = createTeam({
        name: 'Test Team',
        description: 'Test description',
        memberCount: 1,
        leader: '',
        members: [],
      }, 'leader@example.com')

      const incident = createIncident({
        title: 'Test Incident',
        description: 'Test description',
        severity: 'high',
        status: 'acknowledged',
        assignedTo: 'John Doe',
        team: team.name,
      })

      escalateIncident(incident.id, 'member@example.com')

      const notifications = getNotificationsForUser('leader@example.com')
      expect(notifications.length).toBeGreaterThan(0)
      expect(notifications[0].message).toContain('escalated')
    })

    it('should return null for non-existent incident', () => {
      const updated = escalateIncident('non-existent-id', 'user@example.com')
      expect(updated).toBeNull()
    })
  })

  describe('resolveIncident', () => {
    it('should resolve an incident', () => {
      const incident = createIncident({
        title: 'Test Incident',
        description: 'Test description',
        severity: 'high',
        status: 'escalated',
        assignedTo: 'John Doe',
        team: 'General',
      })
      const updated = resolveIncident(incident.id)
      expect(updated?.status).toBe('resolved')
    })

    it('should return null for non-existent incident', () => {
      const updated = resolveIncident('non-existent-id')
      expect(updated).toBeNull()
    })
  })
})

describe('Releases', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createRelease', () => {
    it('should create a new release', () => {
      const release = createRelease({
        version: '1.0.0',
        description: 'First release',
        team: 'General',
        totalSteps: 5,
      })
      expect(release).toBeDefined()
      expect(release.version).toBe('1.0.0')
      expect(release.status).toBe('created')
      expect(release.currentStep).toBe(1)
    })

    it('should generate unique ID for each release', async () => {
      const release1 = createRelease({
        version: '1.0.0',
        description: 'Release 1',
        team: 'General',
        totalSteps: 5,
      })
      await new Promise(resolve => setTimeout(resolve, 1))
      const release2 = createRelease({
        version: '2.0.0',
        description: 'Release 2',
        team: 'General',
        totalSteps: 5,
      })
      expect(release1.id).not.toBe(release2.id)
    })
  })

  describe('getReleases', () => {
    it('should return all releases', () => {
      createRelease({
        version: '1.0.0',
        description: 'Release 1',
        team: 'General',
        totalSteps: 5,
      })
      createRelease({
        version: '2.0.0',
        description: 'Release 2',
        team: 'General',
        totalSteps: 5,
      })
      const releases = getReleases()
      expect(releases.length).toBe(2)
    })

    it('should return empty array when no releases', () => {
      const releases = getReleases()
      expect(releases).toEqual([])
    })
  })

  describe('updateReleaseStep', () => {
    it('should update release step', () => {
      const release = createRelease({
        version: '1.0.0',
        description: 'First release',
        team: 'General',
        totalSteps: 5,
      })
      const updated = updateReleaseStep(release.id)
      expect(updated?.currentStep).toBe(2)
      expect(updated?.status).toBe('in_progress')
    })

    it('should mark release as completed when all steps done', () => {
      const release = createRelease({
        version: '1.0.0',
        description: 'First release',
        team: 'General',
        totalSteps: 2,
      })
      updateReleaseStep(release.id)
      const updated = updateReleaseStep(release.id)
      expect(updated?.status).toBe('completed')
    })

    it('should return null for non-existent release', () => {
      const updated = updateReleaseStep('non-existent-id')
      expect(updated).toBeNull()
    })
  })

  describe('cancelRelease', () => {
    it('should cancel a release', () => {
      const release = createRelease({
        version: '1.0.0',
        description: 'First release',
        team: 'General',
        totalSteps: 5,
      })
      const updated = cancelRelease(release.id)
      expect(updated?.status).toBe('cancelled')
    })

    it('should return null for non-existent release', () => {
      const updated = cancelRelease('non-existent-id')
      expect(updated).toBeNull()
    })
  })
})

describe('Teams', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createTeam', () => {
    it('should create a new team with leader', () => {
      const team = createTeam(
        {
          name: 'Test Team',
          description: 'Test description',
          memberCount: 1,
          leader: '',
          members: [],
        },
        'leader@example.com'
      )
      expect(team).toBeDefined()
      expect(team.name).toBe('Test Team')
      expect(team.leader).toBe('leader@example.com')
      expect(team.members).toContain('leader@example.com')
    })

    it('should generate unique invitation code', () => {
      const team1 = createTeam(
        {
          name: 'Team 1',
          description: 'Description 1',
          memberCount: 1,
          leader: '',
          members: [],
        },
        'leader1@example.com'
      )
      const team2 = createTeam(
        {
          name: 'Team 2',
          description: 'Description 2',
          memberCount: 1,
          leader: '',
          members: [],
        },
        'leader2@example.com'
      )
      expect(team1.invitationCode).not.toBe(team2.invitationCode)
    })
  })

  describe('getTeams', () => {
    it('should return all teams', () => {
      createTeam(
        {
          name: 'Team 1',
          description: 'Description 1',
          memberCount: 1,
          leader: '',
          members: [],
        },
        'leader1@example.com'
      )
      createTeam(
        {
          name: 'Team 2',
          description: 'Description 2',
          memberCount: 1,
          leader: '',
          members: [],
        },
        'leader2@example.com'
      )
      const teams = getTeams()
      expect(teams.length).toBe(2)
    })

    it('should return empty array when no teams', () => {
      const teams = getTeams()
      expect(teams).toEqual([])
    })
  })

  describe('joinTeam', () => {
    it('should allow user to join team', () => {
      const team = createTeam(
        {
          name: 'Test Team',
          description: 'Test description',
          memberCount: 1,
          leader: '',
          members: [],
        },
        'leader@example.com'
      )

      const result = joinTeam(team.id, 'member@example.com')
      expect(result.success).toBe(true)
      expect(result.team?.members).toContain('member@example.com')
      expect(result.team?.memberCount).toBe(2)
    })

    it('should prevent duplicate team membership', () => {
      const team = createTeam(
        {
          name: 'Test Team',
          description: 'Test description',
          memberCount: 1,
          leader: '',
          members: [],
        },
        'leader@example.com'
      )

      joinTeam(team.id, 'member@example.com')
      const result = joinTeam(team.id, 'member@example.com')
      expect(result.success).toBe(false)
      expect(result.error).toContain('already a member')
    })

    it('should return error for non-existent team', () => {
      const result = joinTeam('non-existent-id', 'member@example.com')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })
})

describe('Notifications', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('addNotification', () => {
    it('should add a notification', () => {
      const notification = addNotification(
        'user@example.com',
        'Test message',
        'incident'
      )
      expect(notification).toBeDefined()
      expect(notification.recipient).toBe('user@example.com')
      expect(notification.message).toBe('Test message')
      expect(notification.type).toBe('incident')
      expect(notification.read).toBe(false)
    })

    it('should generate unique ID for each notification', async () => {
      const notification1 = addNotification(
        'user@example.com',
        'Message 1',
        'incident'
      )
      await new Promise(resolve => setTimeout(resolve, 1))
      const notification2 = addNotification(
        'user@example.com',
        'Message 2',
        'release'
      )
      expect(notification1.id).not.toBe(notification2.id)
    })
  })

  describe('getNotificationsForUser', () => {
    it('should return notifications for specific user', () => {
      addNotification('user1@example.com', 'Message 1', 'incident')
      addNotification('user2@example.com', 'Message 2', 'incident')
      addNotification('user1@example.com', 'Message 3', 'release')

      const notifications = getNotificationsForUser('user1@example.com')
      expect(notifications.length).toBe(2)
      expect(notifications.every(n => n.recipient === 'user1@example.com')).toBe(true)
    })

    it('should return empty array for user with no notifications', () => {
      const notifications = getNotificationsForUser('nonexistent@example.com')
      expect(notifications).toEqual([])
    })
  })
})
