import { 
  users, tasks, studySessions, userProgress,
  type User, type InsertUser,
  type Task, type InsertTask,
  type StudySession, type InsertStudySession,
  type UserProgress, type InsertUserProgress
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  getStudySessions(userId: number): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: number, updates: Partial<StudySession>): Promise<StudySession | undefined>;
  
  getUserProgress(userId: number, date?: Date): Promise<UserProgress | undefined>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getWeeklyProgress(userId: number): Promise<UserProgress[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private studySessions: Map<number, StudySession>;
  private userProgress: Map<string, UserProgress>;
  private currentUserId: number;
  private currentTaskId: number;
  private currentSessionId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.studySessions = new Map();
    this.userProgress = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
    this.currentSessionId = 1;
    this.currentProgressId = 1;
    
    this.initializeDefaultTasks();
  }

  private initializeDefaultTasks() {
    const defaultTasks = [
      {
        title: "مذاكرة شابتر واحد مادة نظم التشغيل",
        userId: 1,
        points: 15,
        completed: false,
        description: "مراجعة ودراسة فصل واحد من مادة نظم التشغيل"
      },
      {
        title: "حل واجب الخوارزميات وهياكل البيانات",
        userId: 1,
        points: 20,
        completed: false,
        description: "إنجاز الواجب المطلوب في مادة الخوارزميات وهياكل البيانات"
      },
      {
        title: "تجهيز لبرزنتيشن مادة البرمجة الغرضية",
        userId: 1,
        points: 25,
        completed: false,
        description: "إعداد العرض التقديمي لمادة البرمجة الغرضية"
      }
    ];

    defaultTasks.forEach(taskData => {
      const id = this.currentTaskId++;
      const task: Task = {
        ...taskData,
        id,
        description: taskData.description,
        dueDate: null,
        createdAt: new Date(),
      };
      this.tasks.set(id, task);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      totalPoints: 0,
      level: 1,
      currentXP: 0,
      badges: [],
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      ...insertTask,
      id,
      points: insertTask.points ?? 10,
      description: insertTask.description ?? null,
      completed: insertTask.completed ?? false,
      dueDate: insertTask.dueDate ?? null,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getStudySessions(userId: number): Promise<StudySession[]> {
    return Array.from(this.studySessions.values()).filter(session => session.userId === userId);
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const id = this.currentSessionId++;
    const session: StudySession = {
      ...insertSession,
      id,
      completed: insertSession.completed ?? false,
      focusScore: insertSession.focusScore ?? null,
      sessionType: insertSession.sessionType ?? "pomodoro",
      createdAt: new Date(),
    };
    this.studySessions.set(id, session);
    return session;
  }

  async updateStudySession(id: number, updates: Partial<StudySession>): Promise<StudySession | undefined> {
    const session = this.studySessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.studySessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserProgress(userId: number, date?: Date): Promise<UserProgress | undefined> {
    const dateKey = date ? date.toDateString() : new Date().toDateString();
    const key = `${userId}-${dateKey}`;
    return this.userProgress.get(key);
  }

  async createOrUpdateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const dateKey = insertProgress.date ? insertProgress.date.toDateString() : new Date().toDateString();
    const key = `${insertProgress.userId}-${dateKey}`;
    
    const existing = this.userProgress.get(key);
    if (existing) {
      const updated = { ...existing, ...insertProgress };
      this.userProgress.set(key, updated);
      return updated;
    }
    
    const id = this.currentProgressId++;
    const progress: UserProgress = {
      ...insertProgress,
      id,
      studyHours: insertProgress.studyHours ?? 0,
      tasksCompleted: insertProgress.tasksCompleted ?? 0,
      focusStreak: insertProgress.focusStreak ?? 0,
      date: insertProgress.date || new Date(),
    };
    this.userProgress.set(key, progress);
    return progress;
  }

  async getWeeklyProgress(userId: number): Promise<UserProgress[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return Array.from(this.userProgress.values())
      .filter(progress => 
        progress.userId === userId && 
        progress.date && 
        progress.date >= weekAgo
      );
  }
}

export const storage = new MemStorage();
