/** Watt-son (節能仔): the Cool Shift companion. Moods: happy, cheer, hot, wave. */
export default function Mascot({ mood = 'happy', size = 64, className = '' }) {
  const cheer = mood === 'cheer'
  const hot = mood === 'hot'
  const wave = mood === 'wave'
  return (
    <svg
      className={`mascot mascot-${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Watt-son, the Cool Shift mascot"
    >
      <ellipse cx="60" cy="112" rx="28" ry="5" fill="#000" opacity="0.08" />
      {/* antenna bolt */}
      <path d="M62 4 L52 22 H60 L56 34 L70 16 H62 L66 4 Z" fill="#7be0b0" stroke="#12329a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* arms */}
      {cheer ? (
        <>
          <path d="M22 58 Q10 44 14 30" stroke="#12329a" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M98 58 Q110 44 106 30" stroke="#12329a" strokeWidth="7" strokeLinecap="round" fill="none" />
        </>
      ) : wave ? (
        <>
          <path d="M22 70 Q12 78 16 88" stroke="#12329a" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path className="wave-arm" d="M98 62 Q112 52 108 38" stroke="#12329a" strokeWidth="7" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M22 70 Q12 78 16 88" stroke="#12329a" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M98 70 Q108 78 104 88" stroke="#12329a" strokeWidth="7" strokeLinecap="round" fill="none" />
        </>
      )}
      {/* body */}
      <rect x="20" y="30" width="80" height="78" rx="34" fill="#12329a" />
      <rect x="28" y="38" width="64" height="40" rx="20" fill="#2447b5" />
      {/* eyes */}
      {cheer ? (
        <>
          <path d="M40 58 Q46 50 52 58" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M68 58 Q74 50 80 58" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="46" cy="57" rx="7" ry="8" fill="#fff" />
          <ellipse cx="74" cy="57" rx="7" ry="8" fill="#fff" />
          <circle className="pupil" cx="47.5" cy="58" r="3.5" fill="#12329a" />
          <circle className="pupil" cx="75.5" cy="58" r="3.5" fill="#12329a" />
        </>
      )}
      {/* cheeks */}
      <ellipse cx="36" cy="72" rx="5" ry="3" fill="#7be0b0" opacity="0.85" />
      <ellipse cx="84" cy="72" rx="5" ry="3" fill="#7be0b0" opacity="0.85" />
      {/* mouth */}
      {hot ? (
        <ellipse cx="60" cy="76" rx="5" ry="4" fill="#fff" />
      ) : (
        <path d={cheer ? 'M48 72 Q60 86 72 72 Z' : 'M50 73 Q60 81 70 73'} stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill={cheer ? '#fff' : 'none'} />
      )}
      {/* leaf badge */}
      <path d="M56 96 Q60 86 68 88 Q66 98 56 96 Z" fill="#7be0b0" />
      {hot && <path d="M92 36 Q98 46 92 50 Q86 46 92 36 Z" fill="#7cc4ff" />}
      {cheer && (
        <g fill="#7be0b0">
          <path d="M8 18 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" />
          <path d="M108 8 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" />
        </g>
      )}
    </svg>
  )
}
