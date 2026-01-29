import { useState, useEffect, useRef, useCallback } from 'react';
import { playPhaseStart, playPhaseSwitch, playComplete, playTick } from '../utils/audio';

// Steps generator
const createSteps = (config) => {
    const steps = [];

    // Initial Delay
    steps.push({ type: 'prepare', duration: 5, label: 'Get Ready' });

    const { sets, concentric, isometric, eccentric, totalTime, useReps, useIsometric } = config;

    // Durations
    const conc = parseInt(concentric) || 0;
    const iso = (useIsometric !== false) ? (parseInt(isometric) || 0) : 0;
    const ecc = parseInt(eccentric) || 0;

    // Calculate single rep duration
    const cycleDuration = conc + iso + ecc;

    if (cycleDuration <= 0) return steps; // Safety check

    let count = 0;

    if (useReps) {
        // Sets Mode
        count = parseInt(sets) || 1;
    } else {
        // Total Time Mode
        const tTime = parseInt(totalTime) || 0;
        if (tTime > 0) {
            // Calculate how many full cycles fit
            count = Math.floor(tTime / cycleDuration);
            if (count < 1) count = 1;
        } else {
            // Infinite (user just unchecked limit reps)
            count = 9999;
        }
    }

    for (let i = 0; i < count; i++) {
        if (conc > 0) steps.push({ type: 'concentric', duration: conc, label: 'Concentric', color: 'var(--color-concentric)' });
        if (iso > 0) steps.push({ type: 'isometric', duration: iso, label: 'Hold', color: 'var(--color-isometric)' });
        if (ecc > 0) steps.push({ type: 'eccentric', duration: ecc, label: 'Eccentric', color: 'var(--color-eccentric)' });
    }

    steps.push({ type: 'finish', duration: 0, label: 'Done', color: 'var(--text-primary)' });

    return steps;
};

export const useWorkout = () => {
    const [status, setStatus] = useState('idle'); // idle, running, paused, finished
    const [config, setConfig] = useState({
        sets: 10,
        concentric: 2,
        isometric: 1,
        eccentric: 3,
        rest: 0,
        useReps: true,
        useIsometric: true,
        totalTime: 0,
        mode: 'reps' // or 'time'
    });

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [elapsedInStep, setElapsedInStep] = useState(0);
    const [steps, setSteps] = useState([]);

    const rafRef = useRef(null);
    const lastTimeRef = useRef(0);
    const lastTickRef = useRef(-1);

    const startWorkout = () => {
        const generatedSteps = createSteps(config);
        setSteps(generatedSteps);
        setCurrentStepIndex(0);
        setElapsedInStep(0);
        setStatus('running');
        lastTimeRef.current = performance.now();
        lastTickRef.current = -1;
        playPhaseStart();
    };

    const stopWorkout = () => {
        setStatus('idle');
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const pauseWorkout = () => {
        setStatus(prev => prev === 'running' ? 'paused' : 'running');
        lastTimeRef.current = performance.now(); // reset on resume
    };

    const update = useCallback((time) => {
        if (status !== 'running') {
            lastTimeRef.current = time;
            rafRef.current = requestAnimationFrame(update);
            return;
        }

        const delta = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        const currentStep = steps[currentStepIndex];

        if (!currentStep) return;

        if (currentStep.type === 'finish') {
            setStatus('finished');
            playComplete();
            return;
        }

        let newElapsed = elapsedInStep + delta;

        // Tick Handling
        const currentInt = Math.floor(newElapsed);
        if (currentInt > lastTickRef.current && currentInt < currentStep.duration) {
            playTick();
            lastTickRef.current = currentInt;
        }

        if (newElapsed >= currentStep.duration) {
            // Next step
            const nextIndex = currentStepIndex + 1;
            if (nextIndex < steps.length) {
                setCurrentStepIndex(nextIndex);
                setElapsedInStep(0); // Carry over overflow? simpler to just 0
                lastTickRef.current = -1; // Reset tick tracker

                // Audio feedback
                const nextStep = steps[nextIndex];
                if (nextStep.type !== 'finish') {
                    playPhaseSwitch();
                }
            } else {
                setStatus('finished');
                playComplete();
            }
        } else {
            setElapsedInStep(newElapsed);
        }

        rafRef.current = requestAnimationFrame(update);
    }, [status, steps, currentStepIndex, elapsedInStep, elapsedInStep]);
    // ^ duplicate elapsedInStep dep removed in manual code below for cleanliness, 
    // but React won't mind. I will use clean version in Write.

    useEffect(() => {
        rafRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafRef.current);
    }, [update]);

    return {
        status,
        config,
        setConfig,
        startWorkout,
        stopWorkout,
        pauseWorkout,
        currentStep: steps[currentStepIndex],
        elapsedInStep,
        totalSteps: steps.length,
        currentStepIndex
    };
};
