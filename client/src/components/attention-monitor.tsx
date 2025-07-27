import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Camera, Video } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";

interface AttentionMonitorProps {
  onRequestCamera: () => void;
}

export default function AttentionMonitor({ onRequestCamera }: AttentionMonitorProps) {
  const [focusScore, setFocusScore] = useState(85);
  const { 
    isActive, 
    hasPermission, 
    videoRef, 
    startMonitoring, 
    stopMonitoring 
  } = useCamera({
    onFocusChange: (score) => setFocusScore(score)
  });

  const handleToggleMonitoring = () => {
    if (!hasPermission) {
      onRequestCamera();
      return;
    }
    
    if (isActive) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow border-t-4 border-success">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="bg-success text-white w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
            <Eye className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-bold text-primary mb-2">مراقبة الانتباه</h4>
          <p className="text-warm-gray-600">تتبع ذكي لمستوى تركيزك</p>
        </div>
        
        <div className="bg-warm-gray-100 rounded-xl p-4 mb-4 text-center">
          {hasPermission && isActive ? (
            <video
              ref={videoRef}
              className="w-full h-32 rounded-lg bg-black"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="bg-warm-gray-300 w-full h-32 rounded-lg flex items-center justify-center mb-3">
              <Camera className="h-12 w-12 text-warm-gray-500" />
            </div>
          )}
          <p className="text-sm text-warm-gray-600 mb-3">
            {hasPermission 
              ? (isActive ? "المراقبة نشطة" : "اضغط لبدء المراقبة")
              : "اضغط للسماح بالوصول للكاميرا"
            }
          </p>
          <Button
            onClick={handleToggleMonitoring}
            className={`${
              isActive 
                ? "bg-red-500 hover:bg-red-600 text-white font-bold" 
                : "bg-secondary hover:bg-secondary-dark text-warm-gray-800 font-bold"
            } text-sm px-4 py-2`}
          >
            <Video className="ml-1 h-4 w-4" />
            {isActive ? "إيقاف المراقبة" : "تفعيل المراقبة"}
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-success mb-1">{focusScore}%</div>
          <p className="text-sm text-warm-gray-600">نسبة التركيز الحالية</p>
        </div>
      </CardContent>
    </Card>
  );
}
