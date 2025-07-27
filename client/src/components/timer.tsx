import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play, Pause, Square } from "lucide-react";
import { useTimer } from "@/hooks/use-timer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TimerProps {
  userId: number;
}

export default function Timer({ userId }: TimerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sessionsToday, setSessionsToday] = useState(3);
  
  const { 
    timeLeft, 
    isRunning, 
    isBreak, 
    start, 
    pause, 
    reset 
  } = useTimer({
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    onComplete: () => {
      if (!isBreak) {
        setSessionsToday(prev => prev + 1);
        completeSession.mutate({
          userId,
          duration: 25,
          completed: true,
          sessionType: "pomodoro"
        });
      }
    }
  });

  const completeSession = useMutation({
    mutationFn: async (sessionData: any) => {
      return apiRequest("POST", "/api/sessions", sessionData);
    },
    onSuccess: () => {
      toast({
        title: "تم إكمال الجلسة!",
        description: "أحسنت! لقد أكملت جلسة تركيز ناجحة.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "sessions"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ بيانات الجلسة",
        variant: "destructive",
      });
    }
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="hover:shadow-xl transition-shadow border-t-4 border-primary">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="bg-primary text-white w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
            <Clock className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold text-primary mb-2">نظام الطماطم</h4>
          <p className="text-warm-gray-600">فترات مذاكرة مُنظمة مع فترات راحة</p>
        </div>
        
        <div className="bg-warm-gray-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-warm-gray-600 mb-4">
              {isBreak ? "وقت الراحة" : "وقت التركيز"}
            </div>
            <div className="flex justify-center space-x-reverse space-x-2">
              <Button
                onClick={isRunning ? pause : start}
                className="bg-secondary text-warm-gray-800 hover:bg-secondary-dark"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="bg-warm-gray-200 text-warm-gray-600 hover:bg-warm-gray-300"
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-warm-gray-600">الجلسات اليوم:</span>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary ml-2">{sessionsToday}</span>
            <div className="flex space-x-reverse space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < sessionsToday ? 'bg-secondary' : 'bg-warm-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
