import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

interface TaskManagerProps {
  userId: number;
}

export default function TaskManager({ userId }: TaskManagerProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/users", userId, "tasks"],
    enabled: !!userId,
  });

  const createTask = useMutation({
    mutationFn: async (taskData: { title: string; userId: number; points: number }) => {
      return apiRequest("POST", "/api/tasks", taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "tasks"] });
      setNewTaskTitle("");
      toast({
        title: "تمت إضافة المهمة",
        description: "تم إضافة المهمة الجديدة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة المهمة",
        variant: "destructive",
      });
    }
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "tasks"] });
      toast({
        title: "تم تحديث المهمة",
        description: "تم تحديث حالة المهمة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث المهمة",
        variant: "destructive",
      });
    }
  });

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    createTask.mutate({
      title: newTaskTitle,
      userId,
      points: 10
    });
  };

  const handleToggleTask = (task: Task) => {
    updateTask.mutate({
      id: task.id,
      updates: { completed: !task.completed }
    });
  };

  const completedTasks = tasks.filter((task: Task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const dailyPoints = tasks
    .filter((task: Task) => task.completed)
    .reduce((sum: number, task: Task) => sum + (task.points || 0), 0);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">مهام اليوم</h3>
          <div className="flex space-x-reverse space-x-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="إضافة مهمة جديدة..."
              className="w-48"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim() || createTask.isPending}
              className="bg-secondary text-warm-gray-800 hover:bg-secondary-dark"
            >
              <Plus className="ml-1 h-4 w-4" />
              إضافة
            </Button>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {tasks.length === 0 ? (
            <div className="text-center text-warm-gray-500 py-8">
              لا توجد مهام اليوم. أضف مهمة جديدة للبدء!
            </div>
          ) : (
            tasks.map((task: Task) => (
              <div
                key={task.id}
                className="flex items-center p-4 bg-warm-gray-50 rounded-lg hover:bg-warm-gray-100 transition-colors"
              >
                <Checkbox
                  checked={task.completed || false}
                  onCheckedChange={() => handleToggleTask(task)}
                  className="ml-3"
                />
                <div className="flex-1">
                  <p className={`font-semibold text-warm-gray-800 ${
                    task.completed ? 'line-through' : ''
                  }`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-warm-gray-600">
                    {task.completed ? 'مكتملة' : 'في الانتظار'}
                  </p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                  task.completed 
                    ? 'bg-secondary text-warm-gray-800' 
                    : 'text-warm-gray-400'
                }`}>
                  +{task.points || 10}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-warm-gray-600 mb-2">
            <span>التقدم اليومي</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
        
        <div className="text-center">
          <p className="text-warm-gray-600 mb-2">
            نقاط اليوم: <span className="font-bold text-primary">{dailyPoints}</span>
          </p>
          <p className="text-xs text-warm-gray-500">
            أكمل مهمة أخرى للحصول على شارة "بطل اليوم"!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
