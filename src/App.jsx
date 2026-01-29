import { useState } from 'react';
import { useWorkout } from './hooks/useWorkout';
import { Setup } from './components/Setup';
import { ActiveWorkout } from './components/ActiveWorkout';
import './App.css';

function App() {
  const {
    status,
    config,
    setConfig,
    startWorkout,
    stopWorkout,
    pauseWorkout,
    currentStep,
    elapsedInStep,
    totalSteps,
    currentStepIndex
  } = useWorkout();

  return (
    <>
      {(status === 'idle' || status === 'finished') && (
        <Setup
          config={config}
          setConfig={setConfig}
          onStart={startWorkout}
        />
      )}

      {(status === 'running' || status === 'paused') && (
        <ActiveWorkout
          status={status}
          currentStep={currentStep}
          elapsedInStep={elapsedInStep}
          onPause={pauseWorkout}
          onStop={stopWorkout}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />
      )}
    </>
  );
}

export default App;
