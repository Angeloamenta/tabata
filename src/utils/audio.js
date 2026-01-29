// Simple audio synth for beeps
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const playBeep = (freq = 440, type = 'sine', duration = 0.1) => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playPhaseStart = () => playBeep(880, 'sine', 0.1);
export const playPhaseSwitch = () => playBeep(600, 'triangle', 0.1);
export const playComplete = () => {
    playBeep(500, 'square', 0.1);
    setTimeout(() => playBeep(500, 'square', 0.1), 150);
    setTimeout(() => playBeep(800, 'square', 0.3), 300);
};
