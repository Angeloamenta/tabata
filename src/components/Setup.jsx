import React from 'react';
import { Play } from 'lucide-react';
import { DottedProgressRing } from './DottedProgressRing';
import '../styles/Setup.css';

const Toggle = ({ value, onChange, label }) => (
    <div className="input-group toggle-group" onClick={() => onChange(!value)}>
        <label className="input-label">{label}</label>
        <div className={`active-toggle ${value ? 'on' : 'off'}`}>
            <div className="toggle-handle" />
        </div>
    </div>
);

const InputGroup = ({ label, value, onChange, min = 0, step = 1, disabled = false }) => {
    if (disabled) return null;
    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <div className="input-wrapper">
                <button type="button" onClick={() => onChange(Math.max(min, parseInt(value || 0) - step))}>−</button>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                />
                <button type="button" onClick={() => onChange(parseInt(value || 0) + step)}>+</button>
            </div>
        </div>
    );
};

export const Setup = ({ config, setConfig, onStart }) => {
    const handleChange = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

    const conc = parseInt(config.concentric) || 0;
    const iso = config.useIsometric ? (parseInt(config.isometric) || 0) : 0;
    const ecc = parseInt(config.eccentric) || 0;
    const cycleTotal = conc + iso + ecc || 1;
    const concPct = (conc / cycleTotal) * 100;
    const isoPct = (iso / cycleTotal) * 100;
    const eccPct = (ecc / cycleTotal) * 100;

    const estDuration = config.useReps
        ? ((config.sets * (conc + iso + ecc)) + 5) + "s"
        : (config.totalTime > 0 ? config.totalTime + "s (+5s)" : "—");

    const reps = parseInt(config.sets) || 0;

    return (
        <div className="setup-container fade-in">
            <header className="header">
                <h1>Tabata<span className="accent">Pulse</span></h1>
            </header>

            <div className="setup-grid">
                {/* Top row: metric cards */}
                <div className="metric-card">
                    <div className="metric-card-inner">
                        <span className="metric-value">{reps}</span>
                        <span className="metric-unit">reps</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-card-inner">
                        <span className="metric-value">{estDuration}</span>
                        <span className="metric-unit">est.</span>
                    </div>
                </div>

                {/* Middle: phases card with 3 circular indicators */}
                <section className="phases-card">
                    <h2 className="card-title">Fasi</h2>
                    <div className="phases-row">
                        <div className="phase-item">
                            <div className="phase-ring-wrap">
                                <DottedProgressRing percent={concPct} size={72} color="var(--color-concentric)" />
                                <span className="phase-value">{conc}</span>
                            </div>
                            <span className="phase-label">Concentric</span>
                            <div className="phase-input">
                                <button type="button" onClick={() => handleChange('concentric', Math.max(0, conc - 1))}>−</button>
                                <input type="number" value={config.concentric} onChange={(e) => handleChange('concentric', parseInt(e.target.value) || 0)} />
                                <button type="button" onClick={() => handleChange('concentric', conc + 1)}>+</button>
                            </div>
                        </div>
                        <div className="phase-item">
                            <div className="phase-ring-wrap">
                                <DottedProgressRing percent={isoPct} size={72} color="var(--color-isometric)" />
                                <span className="phase-value">{iso}</span>
                            </div>
                            <span className="phase-label">Hold</span>
                            <div className="phase-input">
                                <button type="button" onClick={() => handleChange('isometric', Math.max(0, iso - 1))} disabled={!config.useIsometric}>−</button>
                                <input type="number" value={config.isometric} onChange={(e) => handleChange('isometric', parseInt(e.target.value) || 0)} disabled={!config.useIsometric} />
                                <button type="button" onClick={() => handleChange('isometric', iso + 1)} disabled={!config.useIsometric}>+</button>
                            </div>
                        </div>
                        <div className="phase-item">
                            <div className="phase-ring-wrap">
                                <DottedProgressRing percent={eccPct} size={72} color="var(--color-eccentric)" />
                                <span className="phase-value">{ecc}</span>
                            </div>
                            <span className="phase-label">Eccentric</span>
                            <div className="phase-input">
                                <button type="button" onClick={() => handleChange('eccentric', Math.max(0, ecc - 1))}>−</button>
                                <input type="number" value={config.eccentric} onChange={(e) => handleChange('eccentric', parseInt(e.target.value) || 0)} />
                                <button type="button" onClick={() => handleChange('eccentric', ecc + 1)}>+</button>
                            </div>
                        </div>
                    </div>
                    <Toggle label="Include Hold" value={config.useIsometric} onChange={v => handleChange('useIsometric', v)} />
                </section>

                {/* Reps / Time card */}
                <section className="card">
                    <h2 className="card-title">Ripetizioni</h2>
                    <Toggle label="Limit Repetitions" value={config.useReps} onChange={v => handleChange('useReps', v)} />
                    {config.useReps ? (
                        <InputGroup label="Number of Reps" value={config.sets} onChange={v => handleChange('sets', v)} min={1} />
                    ) : (
                        <InputGroup label="Total Time (sec)" value={config.totalTime} onChange={v => handleChange('totalTime', v)} min={30} step={10} />
                    )}
                </section>

                {/* Accent CTA card - like the green "24 Days" card */}
                <div className="cta-card">
                    <div className="cta-ring-wrap">
                        <DottedProgressRing percent={100} size={120} color="rgba(255,255,255,0.4)" trackColor="rgba(255,255,255,0.2)" />
                        <span className="cta-label">Ready</span>
                    </div>
                    <button className="start-btn" onClick={onStart}>
                        <Play fill="currentColor" /> START WORKOUT
                    </button>
                </div>
            </div>
        </div>
    );
};
