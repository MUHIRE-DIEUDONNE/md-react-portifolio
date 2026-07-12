import { useEffect, useRef } from "react";

/**
 * ParticleBackground
 * Uduce twera (white dots) tugenda kuva ibumoso ujya iburyo,
 * bikagaragara inyuma ya content (background layer).
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
