import React from 'react';
import { Pause, Square } from 'lucide-react';
import { DottedProgressRing } from './DottedProgressRing';
import '../styles/ActiveWorkout.css';

export const ActiveWorkout = ({
    currentStep,
    elapsedInStep,
    status,
    onPause,
    onStop,
    currentStepIndex,
    totalSteps
}) => {
    const remaining = Math.max(0, currentStep.duration - elapsedInStep);
    const progressPercent = currentStep.duration > 0
        ? Math.min(100, (elapsedInStep / currentStep.duration) * 100)
        : 100;
    const totalProgress = totalSteps > 0 ? (currentStepIndex / totalSteps) * 100 : 0;

    return (
        <div className="workout-container" style={{ '--phase-color': currentStep.color || '#fff' }}>

            <div className="total-progress-track">
                <div className="total-progress-fill" style={{ width: `${totalProgress}%` }} />
            </div>

            <div className="workout-content">
                <div className="phase-badge" style={{ backgroundColor: currentStep.color }}>
                    {currentStep.label}
                </div>

                <div className="timer-ring-wrap">
                    <DottedProgressRing
                        percent={progressPercent}
                        size={220}
                        color={currentStep.color}
                        trackColor="rgba(0,0,0,0.08)"
                    />
                    <div className="timer-display">
                        {remaining.toFixed(1)}<span className="unit">s</span>
                    </div>
                </div>

                <div className="phase-progress-container">
                    <div
                        className="phase-progress-bar"
                        style={{
                            width: `${progressPercent}%`,
                            backgroundColor: currentStep.color
                        }}
                    />
                </div>

                <div className="controls">
                    <button className="control-btn secondary" onClick={onPause}>
                        {status === 'paused' ? 'RESUME' : <Pause />}
                    </button>
                    <button className="control-btn dest" onClick={onStop}>
                        <Square />
                    </button>
                </div>
            </div>

            <div className="bg-pulse" style={{ opacity: status === 'paused' ? 0 : 0.08 }} />
        </div>
    );
};
