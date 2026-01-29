import React from 'react';
import { Play } from 'lucide-react';
import '../styles/Setup.css';

// Toggle Switch Component
const Toggle = ({ value, onChange, label }) => (
    <div className="input-group toggle-group" onClick={() => onChange(!value)}>
        <label className="input-label">{label}</label>
        <div className={`active-toggle ${value ? 'on' : 'off'}`}>
            <div className="toggle-handle" />
        </div>
    </div>
);

const InputGroup = ({ label, value, onChange, min = 0, step = 1, optional = false, disabled = false }) => {
    if (disabled) return null;
    return (
        <div className="input-group fade-in-slide">
            <label className="input-label">
                {label}
            </label>
            <div className="input-wrapper">
                <button onClick={() => onChange(Math.max(min, parseInt(value || 0) - step))}>-</button>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                />
                <button onClick={() => onChange(parseInt(value || 0) + step)}>+</button>
            </div>
        </div>
    );
};

export const Setup = ({ config, setConfig, onStart }) => {
    const handleChange = (key, val) => {
        setConfig(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="setup-container fade-in">
            <header className="header">
                <h1>Tabata<span className="accent">Pulse</span></h1>
                <p>Advanced Tempo Timer</p>
            </header>

            <div className="form-grid">

                {/* Repetitions (Optional Check) */}
                <Toggle
                    label="Limit Repetitions"
                    value={config.useReps}
                    onChange={v => handleChange('useReps', v)}
                />

                {config.useReps ? (
                    <InputGroup
                        label="Number of Reps"
                        value={config.sets}
                        onChange={v => handleChange('sets', v)}
                        min={1}
                    />
                ) : (
                    <InputGroup
                        label="Total Exercise Time (sec)"
                        value={config.totalTime}
                        onChange={v => handleChange('totalTime', v)}
                        min={30}
                        step={10}
                    />
                )}

                <InputGroup
                    label="Concentric (sec)"
                    value={config.concentric}
                    onChange={v => handleChange('concentric', v)}
                />

                {/* Isometric (Optional Check) */}
                <Toggle
                    label="Include Hold (Isometric)"
                    value={config.useIsometric}
                    onChange={v => handleChange('useIsometric', v)}
                />

                <InputGroup
                    label="Hold Duration (sec)"
                    value={config.isometric}
                    onChange={v => handleChange('isometric', v)}
                    disabled={!config.useIsometric}
                />

                <InputGroup
                    label="Eccentric (sec)"
                    value={config.eccentric}
                    onChange={v => handleChange('eccentric', v)}
                />
            </div>

            <button className="start-btn" onClick={onStart}>
                <Play fill="currentColor" /> START WORKOUT
            </button>

            <div className="total-preview">
                Est. Duration: {
                    config.useReps
                        ? ((config.sets * (config.concentric + (config.useIsometric ? config.isometric : 0) + config.eccentric)) + 5) + "s"
                        : (config.totalTime > 0 ? config.totalTime + "s (+5s prep)" : "Continuous (Set Time)")
                }
            </div>
        </div>
    );
};
