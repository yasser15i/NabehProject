import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Camera, Lock, Eye } from "lucide-react";

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  const handleAccept = () => {
    onOpenChange(false);
  };

  const handleDecline = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-secondary rounded-full p-3">
              <Shield className="h-8 w-8 text-warm-gray-800" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold text-primary">
            إذن الوصول للكاميرا
          </DialogTitle>
          <DialogDescription className="text-center text-warm-gray-600 space-y-4">
            <p>
              نحتاج للوصول لكاميرا الجهاز لمراقبة مستوى انتباهك أثناء الدراسة.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Camera className="h-4 w-4 text-secondary ml-2" />
                <span>تسجيل فيديو محلي فقط</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-secondary ml-2" />
                <span>تحليل مستوى التركيز</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-secondary ml-2" />
                <span>لا يتم حفظ أو إرسال أي بيانات</span>
              </div>
            </div>

            <div className="bg-warm-gray-50 p-3 rounded-lg text-xs">
              <strong>ملاحظة مهمة:</strong> جميع البيانات تتم معالجتها محلياً على جهازك ولا يتم إرسال أي معلومات لخوادمنا.
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex space-x-reverse space-x-2">
          <Button
            onClick={handleAccept}
            className="bg-secondary text-warm-gray-800 hover:bg-secondary-dark flex-1"
          >
            السماح بالوصول
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            className="flex-1"
          >
            رفض
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
