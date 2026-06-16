interface IncidentCardProps {
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  state: 'open' | 'acknowledged' | 'escalated' | 'resolved'
}

const severityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
}

const stateColors = {
  open: 'text-blue-400',
  acknowledged: 'text-yellow-400',
  escalated: 'text-orange-400',
  resolved: 'text-green-400',
}

export default function IncidentCard({ title, severity, state }: IncidentCardProps) {
  return (
    <div className="bg-secondary border border-accent rounded-lg p-4 hover:border-primary transition cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-bold ${severityColors[severity]}`}>
          {severity.toUpperCase()}
        </span>
      </div>
      <div className={`text-sm ${stateColors[state]}`}>
        {state.toUpperCase()}
      </div>
    </div>
  )
}
