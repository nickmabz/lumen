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
