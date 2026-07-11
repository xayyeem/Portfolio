import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState('');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Disable on touch/mobile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onDown = () => setHidden(true);
    const onUp = () => setHidden(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const animate = () => {
      // Dot follows quickly
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;
      // Ring follows with interpolation (smooth lag)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };

    // Hover detection for interactive elements
    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor');
        setLabel(text || '');
        ringRef.current?.classList.add('cursor-expand');
      } else if (e.target.closest('a, button, input, textarea, select, [role="button"]')) {
        setLabel('');
        ringRef.current?.classList.add('cursor-hover');
      } else {
        setLabel('');
        ringRef.current?.classList.remove('cursor-expand', 'cursor-hover');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" style={{ mixBlendMode: 'normal' }}>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-brand-400"
        style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.2s' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-brand-400/60 cursor-default"
        style={{
          width: 36,
          height: 36,
          opacity: hidden ? 0 : 1,
          transition: 'width 0.3s ease-smooth, height 0.3s ease-smooth, opacity 0.2s, background-color 0.3s',
        }}
      >
        {label && (
          <span className="text-[8px] font-mono uppercase tracking-widest text-brand-300">
            {label}
          </span>
        )}
      </div>
      <style>{`
        .cursor-expand {
          width: 64px !important;
          height: 64px !important;
          background-color: rgba(26, 179, 175, 0.08);
          border-color: rgba(26, 179, 175, 0.8) !important;
        }
        .cursor-hover {
          width: 48px !important;
          height: 48px !important;
          background-color: rgba(26, 179, 175, 0.05);
        }
      `}</style>
    </div>
  );
}
