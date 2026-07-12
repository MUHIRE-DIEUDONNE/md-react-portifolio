import { useEffect, useRef } from "react";

/**
 * ParticleBackground
 * Uduce twera (white dots) tugenda buhoro buhoro muri background.
 *
 * Uko wayikoresha (usage):
 *   1. Shyira iyi file muri src/components/ParticleBackground.jsx
 *   2. Muri App.jsx, yishyire hejuru ya content yose, isanzwe (position: fixed):
 *
 *      import ParticleBackground from "./components/ParticleBackground";
 *
 *      function App() {
 *        return (
 *          <>
 *            <ParticleBackground />
 *            <div className="app-content">
 *              ... paji zawe zose (Home, About, Projects, ...) ...
 *            </div>
 *          </>
 *        );
 *      }
 *
 *   Kubera ko iyi component ikoresha position: fixed, izagaragara
 *   kuri paji zose zikurikira, nta kongera kuyishyiraho buri paji.
 */
export default function ParticleBackground({
  particleCount = 80,
  color = "rgba(255, 255, 255, 0.8)",
  minSize = 1,
  maxSize = 3,
  speed = 0.3,
}) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    // Buri particle igenda gusa kuva ibumoso ijya iburyo. Iyo igeze ku
    // mpera y'iburyo, izimira maze indi nshya ikavuka ku ruhande
    // rw'ibumoso — bigatuma uhora ubona utundi "tuza" buhoraho.
    const spawnParticle = (randomX = false) => ({
      x: randomX ? Math.random() * canvas.width : -10,
      y: Math.random() * canvas.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      speedX: speed * (0.5 + Math.random()),
      opacity: Math.random() * 0.5 + 0.3,
    });
    const createParticles = () => {
      particles = Array.from({ length: particleCount }, () => spawnParticle(true));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.speedX;

        // Iyo particle isohotse iburyo, iyisubiremo indi nshya ku bumoso
        if (p.x > canvas.width + 10) {
          particles[i] = spawnParticle(false);
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    resize();
    createParticles();
    draw();
    // FIX: was `window.addEventListener("resize", () => { resize(); createParticles(); })`
    // — that anonymous function could never be removed later since the
    // cleanup below called removeEventListener("resize", resize) with a
    // *different* function reference than the one actually attached.
    // Named handler now matches what's added and what's removed.
    const handleResize = () => {
      resize();
      createParticles();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleCount, color, minSize, maxSize, speed]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        // Back to sitting BEHIND all page content (not floating on top
        // while scrolling). NOTE: this only actually shows through if the
        // sections rendered on top of it don't use fully opaque
        // backgrounds — see the note below about lowering background
        // opacity on About/Projects/Experience/Contact so the particles
        // can peek through instead of being fully hidden again.
        zIndex: 0,
      }}
    />
  );
}
