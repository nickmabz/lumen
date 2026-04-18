interface LumenLogoProps {
  size?: number;
  glow?: boolean;
}

export function LumenLogo({ size = 20, glow = true }: LumenLogoProps) {
  return (
    <div
      className={glow ? "lumen-glow" : ""}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 38% 35%, #ffe082, #ffbe3d 55%, #f5a800)",
        flexShrink: 0,
      }}
    />
  );
}

export function LumenThinking() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      className="lumen-thinking"
      style={{ overflow: "visible", flexShrink: 0 }}
    >
      <defs>
        <radialGradient id="lumen-thinking-grad" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffe082" />
          <stop offset="55%" stopColor="#ffbe3d" />
          <stop offset="100%" stopColor="#f5a800" />
        </radialGradient>
      </defs>
      {/* 8 rays distributed around the sun */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 45}, 18, 18)`}>
          <rect
            x="17"
            y="3"
            width="2"
            height="5"
            rx="1"
            fill="#ffbe3d"
            style={{
              transformBox: "fill-box",
              transformOrigin: "50% 100%",
              animation: `ray-extend 1.8s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        </g>
      ))}
      {/* Sun body */}
      <circle
        cx="18"
        cy="18"
        r="7"
        fill="url(#lumen-thinking-grad)"
        style={{
          transformBox: "fill-box",
          transformOrigin: "50% 50%",
          animation: "sun-breathe 1.8s ease-in-out infinite",
        }}
      />
    </svg>
  );
}
