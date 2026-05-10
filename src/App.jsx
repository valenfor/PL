import { useEffect } from 'react'
import { useFlow } from './hooks/useFlow'
import ProgressBar from './components/ProgressBar'
import Screen1 from './components/screens/Screen1'
import Screen2 from './components/screens/Screen2'
import Screen3 from './components/screens/Screen3'
import Screen4 from './components/screens/Screen4'
import Screen5 from './components/screens/Screen5'
import Screen6 from './components/screens/Screen6'

export default function App() {
  const {
    screen,
    formData,
    profile,
    isSubmitting,
    submitted,
    update,
    updateMany,
    goToScreen,
    submitFinal,
    submitPartial,
  } = useFlow()

  // Track abandonment on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (screen > 1 && !submitted) {
        submitPartial({ completion_status: 'abandoned' })
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [screen, submitted, submitPartial])

  return (
    <div className="grain">
      <ProgressBar screen={screen} />

      {screen === 1 && (
        <Screen1 onNext={() => goToScreen(2)} />
      )}

      {screen === 2 && (
        <Screen2
          formData={formData}
          update={update}
          updateMany={updateMany}
          onNext={() => goToScreen(3)}
        />
      )}

      {screen === 3 && (
        <Screen3
          formData={formData}
          update={update}
          onNext={() => goToScreen(4)}
        />
      )}

      {screen === 4 && (
        <Screen4
          formData={formData}
          update={update}
          onNext={() => goToScreen(5)}
        />
      )}

      {screen === 5 && (
        <Screen5
          profile={profile}
          formData={formData}
          onNext={() => goToScreen(6)}
        />
      )}

      {screen === 6 && (
        <Screen6
          formData={formData}
          update={update}
          onSubmit={submitFinal}
          isSubmitting={isSubmitting}
          submitted={submitted}
        />
      )}
    </div>
  )
}
