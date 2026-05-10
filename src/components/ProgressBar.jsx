export default function ProgressBar({ screen, total = 6 }) {
  if (screen === 1) return null

  const steps = total - 1 // screens 2–6
  const current = screen - 1
  const pct = Math.round((current / steps) * 100)

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-0.5 bg-stone-900">
        <div
          className="h-full bg-amber-500 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
