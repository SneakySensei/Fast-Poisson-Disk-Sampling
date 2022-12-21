import { useEffect, useRef } from "react";
import { generatePoissonPointCloud } from "services";

interface BasicPointCloudProps {
  minRadius?: number;
  iterations?: number;
  pointSize?: number;
}

export default function BasicPointCloud({
  iterations = 30,
  minRadius = 10,
  pointSize = 2,
}: BasicPointCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 500;
    canvas.height = 500;

    handleGenerate();
  }, [iterations, minRadius, pointSize]);

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const points = generatePoissonPointCloud({
      gridWidth: canvas.width,
      gridHeight: canvas.height,
      minRadius,
      iterations,
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
      ctx.fillStyle = "#f9b9ff";
      ctx.fill();
    });
  };

  return <canvas className="w-full h-auto max-w-lg" ref={canvasRef} />;
}
