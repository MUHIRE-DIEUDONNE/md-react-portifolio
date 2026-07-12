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

    const createParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Iyo ugeze ku mpera y'ecran, usubira indi ruhande (wrap around)
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

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

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
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
        zIndex: -1,
      }}
    />
  );
}
