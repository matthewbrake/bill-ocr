import React, { useRef, useEffect, useCallback, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
            setError("Your browser does not support camera access.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please ensure permissions are granted.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        onCapture(imageDataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <div className="relative w-full max-w-4xl aspect-video">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg" />
        <canvas ref={canvasRef} className="hidden" />
        {error && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><p className="text-white text-lg p-4 bg-red-600 rounded-md">{error}</p></div>}
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium bg-slate-700 text-white rounded-lg hover:bg-slate-600"
        >
          Cancel
        </button>
        <button
          onClick={handleCapture}
          className="px-8 py-3 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Capture
        </button>
      </div>
    </div>
  );
};
