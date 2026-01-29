import React, { useEffect, useState } from 'react';
import { Pause, Square } from 'lucide-react';
import '../styles/ActiveWorkout.css';

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

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
    const progressPercent = Math.min(100, (elapsedInStep / currentStep.duration) * 100);

    const totalProgress = (currentStepIndex / totalSteps) * 100;

    return (
        <div className="workout-container" style={{ '--phase-color': currentStep.color || '#fff' }}>

            {/* Top Bar: Total Progress */}
            <div className="total-progress-track">
                <div
                    className="total-progress-fill"
                    style={{ width: `${totalProgress}%` }}
                />
            </div>

            <div className="workout-content">
                <div className="phase-badge" style={{ backgroundColor: currentStep.color }}>
                    {currentStep.label}
                </div>

                <div className="timer-display">
                    {remaining.toFixed(1)}<span className="unit">s</span>
                </div>

                {/* Visual Bar for Phase */}
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

            {/* Background Pulse Effect */}
            <div className="bg-pulse" style={{ opacity: status === 'paused' ? 0 : 0.1 }} />
        </div>
    );
};
