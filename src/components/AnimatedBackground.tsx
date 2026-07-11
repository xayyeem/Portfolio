export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-ink-950" />
      {/* Radial glow top-left */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(26,179,175,0.3) 0%, transparent 70%)' }}
      />
      {/* Radial glow bottom-right */}
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-15 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(249,131,7,0.2) 0%, transparent 70%)' }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-grid bg-grid-size opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
    </div>
  );
}
