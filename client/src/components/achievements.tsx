import { Card, CardContent } from "@/components/ui/card";
import { Crown, Flame, Target, Medal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AchievementsProps {
  userId: number;
}

interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
}

const badges: Badge[] = [
  {
    id: "focus-champion",
    name: "بطل التركيز",
    icon: <Crown className="h-6 w-6" />,
    color: "bg-secondary bg-opacity-20 text-secondary",
    earned: true
  },
  {
    id: "session-king",
    name: "ملك الجلسات",
    icon: <Flame className="h-6 w-6" />,
    color: "bg-primary bg-opacity-20 text-primary",
    earned: true
  },
  {
    id: "goal-achiever",
    name: "محقق الأهداف",
    icon: <Target className="h-6 w-6" />,
    color: "bg-success bg-opacity-20 text-success",
    earned: true
  },
  {
    id: "coming-soon",
    name: "قريباً",
    icon: <Medal className="h-6 w-6" />,
    color: "bg-warm-gray-100 text-warm-gray-400",
    earned: false
  }
];

export default function Achievements({ userId }: AchievementsProps) {
  const { data: weeklyProgress = [] } = useQuery({
    queryKey: ["/api/users", userId, "progress", "weekly"],
    enabled: !!userId,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/users", userId, "sessions"],
    enabled: !!userId,
  });

  const weeklyStudyHours = Math.round(
    sessions
      .filter((session: any) => {
        const sessionDate = new Date(session.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      })
      .reduce((total: number, session: any) => total + (session.duration || 0), 0) / 60
  );

  const completedTasks = weeklyProgress.reduce(
    (total: number, day: any) => total + (day.tasksCompleted || 0), 
    0
  );

  const focusStreak = Math.max(
    ...weeklyProgress.map((day: any) => day.focusStreak || 0),
    5
  );

  const currentLevel = 7;
  const currentXP = 2450;
  const nextLevelXP = 3000;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <Card>
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-primary mb-6">لوحة الإنجازات</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-warm-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{weeklyStudyHours}</div>
            <div className="text-xs text-warm-gray-600">ساعات هذا الأسبوع</div>
          </div>
          <div className="text-center p-4 bg-warm-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{completedTasks}</div>
            <div className="text-xs text-warm-gray-600">مهام مكتملة</div>
          </div>
          <div className="text-center p-4 bg-warm-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-success">{focusStreak}</div>
            <div className="text-xs text-warm-gray-600">أيام متتالية</div>
          </div>
        </div>
        
        <div className="mb-8">
          <h4 className="font-bold text-warm-gray-800 mb-4">شاراتي</h4>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                  badge.earned 
                    ? badge.id === 'focus-champion' 
                      ? 'bg-secondary border-secondary text-warm-gray-800' 
                      : badge.id === 'session-king'
                      ? 'bg-primary border-primary text-white'
                      : badge.id === 'goal-achiever'
                      ? 'bg-success border-success text-white'
                      : 'bg-warm-gray-100 border-warm-gray-300 text-warm-gray-400'
                    : 'bg-warm-gray-50 border-warm-gray-200 text-warm-gray-400 opacity-60'
                }`}
              >
                <div className="ml-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {badge.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{badge.name}</p>
                  <p className="text-xs opacity-80">
                    {badge.earned ? 'تم الحصول عليها' : 'لم تحصل عليها بعد'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-lg">المستوى الحالي</h4>
              <p className="text-purple-200">طالب متميز</p>
            </div>
            <div className="text-3xl font-bold">{currentLevel}</div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{currentXP}</span>
              <span>{nextLevelXP}</span>
            </div>
            <div className="w-full bg-primary-dark rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-purple-100">
            {nextLevelXP - currentXP} نقطة للوصول للمستوى التالي
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
