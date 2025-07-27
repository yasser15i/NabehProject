import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Headphones, Leaf, Waves, Music, Volume2, VolumeX, Settings } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";

interface SoundOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  url: string;
}

const soundOptions: SoundOption[] = [
  {
    id: "nature",
    name: "أصوات الطبيعة",
    icon: <Leaf className="h-5 w-5" />,
    color: "text-green-500",
    url: "/sounds/nature.mp3"
  },
  {
    id: "waves",
    name: "أمواج البحر",
    icon: <Waves className="h-5 w-5" />,
    color: "text-blue-500",
    url: "/sounds/waves.mp3"
  },
  {
    id: "classical",
    name: "موسيقى كلاسيكية",
    icon: <Music className="h-5 w-5" />,
    color: "text-purple-500",
    url: "/sounds/classical.mp3"
  }
];

export default function Sounds() {
  const [volumes, setVolumes] = useState<Record<string, number>>({
    nature: 70,
    waves: 0,
    classical: 50
  });
  const { playSound, stopSound, isPlaying } = useAudio();

  const handleVolumeChange = (soundId: string, volume: number[]) => {
    const newVolume = volume[0];
    setVolumes(prev => ({ ...prev, [soundId]: newVolume }));
    
    if (newVolume > 0 && !isPlaying(soundId)) {
      playSound(soundId, newVolume / 100);
    } else if (newVolume === 0 && isPlaying(soundId)) {
      stopSound(soundId);
    } else if (isPlaying(soundId)) {
      playSound(soundId, newVolume / 100);
    }
  };

  const toggleSound = (soundId: string) => {
    const currentVolume = volumes[soundId];
    if (isPlaying(soundId)) {
      stopSound(soundId);
    } else if (currentVolume > 0) {
      playSound(soundId, currentVolume / 100);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow border-t-4 border-secondary">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="bg-secondary text-warm-gray-800 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
            <Headphones className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold text-primary mb-2">أصوات التركيز</h4>
          <p className="text-warm-gray-600">أصوات مهدئة تساعد على التركيز</p>
        </div>
        
        <div className="space-y-3 mb-6">
          {soundOptions.map((sound) => (
            <div
              key={sound.id}
              className="bg-warm-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-warm-gray-100 transition-colors cursor-pointer"
              onClick={() => toggleSound(sound.id)}
            >
              <div className="flex items-center">
                <span className={`ml-3 ${sound.color}`}>
                  {sound.icon}
                </span>
                <span>{sound.name}</span>
              </div>
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                {volumes[sound.id] > 0 ? (
                  <Volume2 className="text-warm-gray-400 h-4 w-4" />
                ) : (
                  <VolumeX className="text-warm-gray-400 h-4 w-4" />
                )}
                <Slider
                  value={[volumes[sound.id]]}
                  onValueChange={(value: number[]) => handleVolumeChange(sound.id, value)}
                  max={100}
                  step={1}
                  className="mr-2 w-16"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full bg-secondary text-warm-gray-800 hover:bg-secondary-dark">
          <Settings className="ml-2 h-4 w-4" />
          إعدادات الصوت
        </Button>
      </CardContent>
    </Card>
  );
}
