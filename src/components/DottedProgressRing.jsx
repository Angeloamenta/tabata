import React from 'react';

/**
 * Dotted circular progress ring - inspired by telecom dashboard style.
 * Track: dotted full circle. Fill: solid arc.
 */
export const DottedProgressRing = ({ percent = 0, size = 80, color = 'var(--color-eccentric)', trackColor = 'rgba(0,0,0,0.12)' }) => {
    const strokeWidth = 2.5;
    const r = (size - strokeWidth * 2) / 2;
    const cx = size / 2;
    const circumference = 2 * Math.PI * r;
    const filled = Math.min(100, Math.max(0, percent)) / 100 * circumference;
    const dotLen = 3;
    const dotGap = 5;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="dotted-ring">
            {/* Track: dotted circle */}
            <circle
                cx={cx}
                cy={cx}
                r={r}
                fill="none"
                stroke={trackColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dotLen} ${dotGap}`}
                strokeLinecap="round"
            />
            {/* Fill: arc */}
            <circle
                cx={cx}
                cy={cx}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${filled} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cx})`}
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
        </svg>
    );
};
