import { useState, useRef, useCallback } from "react";

interface UseCameraProps {
  onFocusChange?: (score: number) => void;
}

export function useCamera({ onFocusChange }: UseCameraProps) {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320, 
          height: 240,
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        setHasPermission(true);
        
        const focusInterval = setInterval(() => {
          const randomScore = Math.floor(Math.random() * 20) + 80;
          if (onFocusChange) {
            onFocusChange(randomScore);
          }
        }, 2000);
        
        (streamRef.current as any).focusInterval = focusInterval;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
    }
  }, [onFocusChange]);

  const stopMonitoring = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      
      if ((streamRef.current as any).focusInterval) {
        clearInterval((streamRef.current as any).focusInterval);
      }
      
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setHasPermission(result.state === 'granted');
    } catch (error) {
      console.error("Error checking camera permission:", error);
    }
  }, []);

  return {
    isActive,
    hasPermission,
    videoRef,
    startMonitoring,
    stopMonitoring,
    checkPermission
  };
}
