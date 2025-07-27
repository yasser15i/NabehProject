import { useState } from "react";
import Navigation from "@/components/navigation";
import Timer from "@/components/timer";
import Sounds from "@/components/sounds";
import AttentionMonitor from "@/components/attention-monitor";
import TaskManager from "@/components/task-manager";
import Achievements from "@/components/achievements";
import PrivacyModal from "@/components/privacy-modal";
import { Button } from "@/components/ui/button";
import { Brain, Play, Clock, Headphones, Eye } from "lucide-react";

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [currentUserId] = useState(1);

  return (
    <div className="min-h-screen bg-warm-gray-50 text-warm-gray-800">
      <Navigation />
      
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-right order-1 lg:order-1 lg:pr-8">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                نبيه
                <span className="block text-secondary">مذاكرتك بأسلوب يناسبك</span>
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-purple-100">
                منصة ذكية تدعم الطلاب المصابين بفرط الحركة وتشتت الانتباه، عبر أدوات مبتكرة تعزز التركيز والتحفيز
              </p>
              <div className="flex justify-end lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-secondary text-warm-gray-800 hover:bg-secondary-dark text-xl font-bold px-8 py-4 h-auto"
                >
                  <Play className="ml-2 h-6 w-6" />
                  ابدأ جلستك الآن
                </Button>
              </div>
            </div>
            <div className="text-center order-2 lg:order-2">
              <div className="bg-primary-dark rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <Clock className="inline ml-2 h-5 w-5 text-secondary" />
                    <span className="text-secondary font-bold">جلسة تركيز: 25 دقيقة</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <Headphones className="inline ml-2 h-5 w-5 text-secondary" />
                    <span className="text-secondary font-bold">أصوات طبيعية للتركيز</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <Eye className="inline ml-2 h-5 w-5 text-secondary" />
                    <span className="text-secondary font-bold">مراقبة ذكية للتركيز</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="study" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">أدواتك للنجاح</h3>
            <p className="text-warm-gray-600 text-lg">كل ما تحتاجه لتحقيق أفضل أداء في المذاكرة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Timer userId={currentUserId} />
            <Sounds />
            <AttentionMonitor onRequestCamera={() => setShowPrivacyModal(true)} />
          </div>
        </div>
      </section>

      <section id="tasks" className="py-16 bg-warm-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <TaskManager userId={currentUserId} />
            <Achievements userId={currentUserId} />
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">نبيه</h3>
              <p className="text-purple-200 mb-4">
                منصة تعليمية مبتكرة تدعم الطلاب ذوي الاحتياجات الخاصة في رحلتهم التعليمية
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">روابط مفيدة</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-secondary transition-colors">عن نبيه</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">كيفية الاستخدام</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">الدعم الفني</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <div className="space-y-3 text-purple-200">
                <div className="flex items-center">
                  <span>yasser30ds@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <span>0530581899</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyModal 
        open={showPrivacyModal} 
        onOpenChange={setShowPrivacyModal}
      />
    </div>
  );
}
