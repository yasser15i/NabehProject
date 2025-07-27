import { useState, useEffect, useCallback } from "react";

interface UseTimerProps {
  workDuration: number;
  breakDuration: number;
  onComplete?: () => void;
}

export function useTimer({ workDuration, breakDuration, onComplete }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workDuration);
  }, [workDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      
      if (onComplete) {
        onComplete();
      }
      
      if (isBreak) {
        setIsBreak(false);
        setTimeLeft(workDuration);
      } else {
        setIsBreak(true);
        setTimeLeft(breakDuration);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, isBreak, workDuration, breakDuration, onComplete]);

  return {
    timeLeft,
    isRunning,
    isBreak,
    start,
    pause,
    reset
  };
}
