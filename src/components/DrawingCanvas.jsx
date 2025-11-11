import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ width, height, savedData, onSave, resetKey }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Fill canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.lineCap = 'round';

    // Load saved drawing if available
    if (savedData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = savedData;
    }
  };

  useEffect(() => {
    initCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData, resetKey]); // re-init if savedData changes or resetKey changes

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (onSave) {
      const canvas = canvasRef.current;
      onSave(canvas.toDataURL());
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};

export default DrawingCanvas;
