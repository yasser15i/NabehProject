import { useState, useRef, useCallback } from "react";

interface UseAudioProps {
  onError?: (error: string) => void;
}

interface AudioElement extends HTMLAudioElement {
  loop: boolean;
}

export function useAudio(props: UseAudioProps = {}) {
  const [playingAudios, setPlayingAudios] = useState<Set<string>>(new Set());
  const audioRefs = useRef<Map<string, AudioElement>>(new Map());

  const playSound = useCallback((soundId: string, volume: number = 1) => {
    try {
      let audio = audioRefs.current.get(soundId);
      
      if (!audio) {
        audio = new Audio() as AudioElement;
        audio.loop = true;
        audio.preload = "auto";
        audioRefs.current.set(soundId, audio);
      }

      audio.volume = Math.max(0, Math.min(1, volume));
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayingAudios(prev => new Set(prev).add(soundId));
          })
          .catch((error) => {
            console.warn(`Audio play failed for ${soundId}:`, error);
            if (props.onError) {
              props.onError(`Failed to play ${soundId}`);
            }
          });
      }
    } catch (error) {
      console.error(`Error playing sound ${soundId}:`, error);
      if (props.onError) {
        props.onError(`Error playing ${soundId}`);
      }
    }
  }, [props]);

  const stopSound = useCallback((soundId: string) => {
    const audio = audioRefs.current.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlayingAudios(prev => {
        const newSet = new Set(prev);
        newSet.delete(soundId);
        return newSet;
      });
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    audioRefs.current.forEach((audio, soundId) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setPlayingAudios(new Set());
  }, []);

  const isPlaying = useCallback((soundId: string) => {
    return playingAudios.has(soundId);
  }, [playingAudios]);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    isPlaying,
    playingAudios: Array.from(playingAudios)
  };
}
