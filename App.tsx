import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  CheckSquare, 
  BarChart2, 
  User, 
  Plus, 
  Sun, 
  Moon, 
  Trophy,
  X,
  Pencil,
  Sparkles,
  Leaf,
  Save // Added Save icon
} from 'lucide-react';
import { Habit, Task, UserProfile, TabView, Priority } from './types';
import { 
  getStoredHabits, addHabit, updateHabit, deleteHabit as deleteDbHabit,
  getStoredTasks, addTask, updateTask, deleteTask as deleteDbTask,
  getStoredUser, saveUser 
} from './services/storageService';
import { generateDailyMotivation, generateHabitInsight } from './services/geminiService';
import HabitCard from './components/HabitCard';
import TaskCard from './components/TaskCard';
import { WeeklyProgressChart, CompletionPieChart } from './components/Charts';
import { COLORS } from './constants';

const App: React.FC = () => {
  // App State
  const [activeTab, setActiveTab] = useState<TabView>('home');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [motivation, setMotivation] = useState<string>("Loading motivation...");
  const [insight, setInsight] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'habit' | 'task' | 'profile'>('habit');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemTime, setNewItemTime] = useState('09:00');
  const [newItemColor, setNewItemColor] = useState(COLORS[6].value); // Default Blue
  const [newItemPriority, setNewItemPriority] = useState<Priority>('Medium');
  const [newItemDesc, setNewItemDesc] = useState('');

  // Form State (Profile)
  const [editUserName, setEditUserName] = useState('');
  const [editUserAvatar, setEditUserAvatar] = useState('');

  // Initialization
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [loadedHabits, loadedTasks, loadedUser] = await Promise.all([
          getStoredHabits(),
          getStoredTasks(),
          getStoredUser()
        ]);
        
        setHabits(loadedHabits);
        setTasks(loadedTasks);
        setUser(loadedUser);

        const completedToday = loadedHabits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length;
        // Generate motivation in background
        if (loadedHabits.length > 0) {
            generateDailyMotivation(completedToday, loadedHabits.length).then(setMotivation);
        } else {
            setMotivation("Welcome! Start by adding your first habit.");
        }
      } catch (error) {
        console.error("Failed to load data from database", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Theme Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Logic Helpers
  const today = new Date().toISOString().split('T')[0];

  const toggleHabit = async (id: string) => {
    const habitToUpdate = habits.find(h => h.id === id);
    if (!habitToUpdate) return;

    const isCompleted = habitToUpdate.completedDates.includes(today);
    const newDates = isCompleted 
      ? habitToUpdate.completedDates.filter(d => d !== today) 
      : [...habitToUpdate.completedDates, today];
    
    const newStreak = isCompleted 
      ? Math.max(0, habitToUpdate.streak - 1) 
      : habitToUpdate.streak + 1;

    const updatedHabit = { 
      ...habitToUpdate, 
      completedDates: newDates, 
      streak: newStreak 
    };

    // Optimistic Update
    setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));
    
    // DB Update
    await updateHabit(updatedHabit);

    // Update user stats if newly completed
    if (!isCompleted && user) {
      const updatedUser = { ...user, totalHabitsCompleted: user.totalHabitsCompleted + 1 };
      setUser(updatedUser);
      await saveUser(updatedUser);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
        setHabits(prev => prev.filter(h => h.id !== id));
        await deleteDbHabit(id);
    }
  };

  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    await updateTask(updatedTask);

    if (updatedTask.completed && user) {
        const updatedUser = { ...user, totalTasksCompleted: user.totalTasksCompleted + 1 };
        setUser(updatedUser);
        await saveUser(updatedUser);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
        setTasks(prev => prev.filter(t => t.id !== id));
        await deleteDbTask(id);
    }
  };

  // CRUD & Modal Handling
  const openAddModal = (type: 'habit' | 'task') => {
    setModalType(type);
    setEditingId(null);
    setNewItemName('');
    setNewItemTime('09:00');
    setNewItemColor(COLORS[6].value);
    setNewItemPriority('Medium');
    setNewItemDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Habit | Task, type: 'habit' | 'task') => {
    setModalType(type);
    setEditingId(item.id);
    if (type === 'habit') {
      const h = item as Habit;
      setNewItemName(h.name);
      setNewItemTime(h.reminderTime);
      setNewItemColor(h.color);
    } else {
      const t = item as Task;
      setNewItemName(t.title);
      setNewItemDesc(t.description || '');
      setNewItemPriority(t.priority);
    }
    setIsModalOpen(true);
  };

  const openProfileEditModal = () => {
    if (user) {
      setModalType('profile');
      setEditUserName(user.name);
      setEditUserAvatar(user.avatarUrl);
      setIsModalOpen(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditUserAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Profile Save
    if (modalType === 'profile') {
      if (user) {
        const updatedUser = { ...user, name: editUserName, avatarUrl: editUserAvatar };
        setUser(updatedUser);
        await saveUser(updatedUser);
      }
      closeModal();
      return;
    }

    const id = editingId || Date.now().toString();
    
    if (modalType === 'habit') {
      if (editingId) {
        // Update Habit
        const existing = habits.find(h => h.id === editingId);
        if (existing) {
          const updatedHabit = { ...existing, name: newItemName, reminderTime: newItemTime, color: newItemColor };
          setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));
          await updateHabit(updatedHabit);
        }
      } else {
        // Create Habit
        const newHabit: Habit = { 
          id, 
          name: newItemName, 
          type: 'Daily', 
          reminderTime: newItemTime, 
          color: newItemColor, 
          streak: 0, 
          completedDates: [] 
        };
        setHabits([...habits, newHabit]);
        await addHabit(newHabit);
      }
    } else {
      if (editingId) {
        // Update Task
        const existing = tasks.find(t => t.id === editingId);
        if (existing) {
            const updatedTask = { ...existing, title: newItemName, description: newItemDesc, priority: newItemPriority };
            setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
            await updateTask(updatedTask);
        }
      } else {
        // Create Task
        const newTask: Task = { 
            id, 
            title: newItemName, 
            description: newItemDesc, 
            date: today, 
            priority: newItemPriority, 
            completed: false 
        };
        setTasks([...tasks, newTask]);
        await addTask(newTask);
      }
    }
    closeModal();
  };

  // Data Logic
  const todaysHabits = habits; 
  const todaysTasks = tasks.filter(t => t.date === today);
  const progressPercent = todaysHabits.length > 0 
    ? (todaysHabits.filter(h => h.completedDates.includes(today)).length / todaysHabits.length) * 100 
    : 0;

  const weeklyData = useMemo(() => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
      day, completed: Math.floor(Math.random() * (habits.length + 1)) 
    }));
  }, [habits.length]);

  useEffect(() => {
    if (activeTab === 'stats' && habits.length > 0) {
      generateHabitInsight(habits).then(setInsight);
    }
  }, [activeTab, habits]);

  // Fallback Name Logic
  const displayName = (user?.name && user.name.trim() !== '') ? user.name : "User";

  if (isLoading) {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
  }

  // Views
  const renderHome = () => (
    <div className="pb-safe animate-slide-up">
      <header className="d-flex justify-content-between align-items-center mb-4 pt-4 px-2">
        <div>
          <h1 className="display-6 fw-bold mb-0 text-primary d-flex align-items-center gap-2">
            <Leaf className="text-primary fill-primary" size={28} />
            DailyGrow
          </h1>
          <p className="text-muted small mb-0 fw-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center transition-all card-hover">
          {darkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
        </button>
      </header>

      {/* Hero Card */}
      <div className="card border-0 mb-4 text-white overflow-hidden shadow-lg bg-gradient-brand rounded-5 card-hover">
        <div className="card-body p-4 position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Sparkles size={18} className="text-white-50" />
            <span className="small text-white-50 fw-bold text-uppercase tracking-wider">Daily Inspiration</span>
          </div>
          <p className="fs-4 fw-medium lh-sm mb-4" style={{ fontFamily: 'Georgia, serif' }}>"{motivation}"</p>
          
          <div className="glass-panel rounded-4 p-3">
            <div className="d-flex justify-content-between small mb-2 fw-medium">
              <span>Today's Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress bg-white bg-opacity-25 rounded-pill" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-white rounded-pill transition-all" 
                role="progressbar" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="position-absolute top-0 end-0 translate-middle p-5 bg-white opacity-10 rounded-circle" style={{ filter: 'blur(40px)' }}></div>
        <div className="position-absolute bottom-0 start-0 translate-middle p-5 bg-black opacity-10 rounded-circle" style={{ filter: 'blur(40px)' }}></div>
      </div>

      {/* Habits Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <h2 className="h5 fw-bold mb-0">Habits</h2>
          <button onClick={() => setActiveTab('habits')} className="btn btn-link text-primary text-decoration-none fw-semibold small p-0">See All</button>
        </div>
        <div className="d-flex flex-column gap-2">
          {todaysHabits.length === 0 && (
            <div className="text-center py-5 border rounded-4 border-dashed">
                <p className="text-muted mb-0">No habits yet. Start blooming! 🌱</p>
            </div>
          )}
          {todaysHabits.map((habit, idx) => (
            <div key={habit.id} className={`animate-slide-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <HabitCard 
                  habit={habit} 
                  isCompletedToday={habit.completedDates.includes(today)} 
                  onToggle={toggleHabit} 
                  onEdit={(h) => openEditModal(h, 'habit')}
                  onDelete={handleDeleteHabit}
                />
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <h2 className="h5 fw-bold mb-0">Tasks</h2>
          <button onClick={() => setActiveTab('tasks')} className="btn btn-link text-primary text-decoration-none fw-semibold small p-0">See All</button>
        </div>
        <div className="d-flex flex-column gap-2">
          {todaysTasks.length === 0 && (
            <div className="text-center py-4 text-muted small">
                All caught up! Time to relax. ☕
            </div>
          )}
          {todaysTasks.map((task, idx) => (
            <div key={task.id} className={`animate-slide-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <TaskCard 
                    task={task} 
                    onToggle={toggleTask} 
                    onDelete={handleDeleteTask}
                    onEdit={(t) => openEditModal(t, 'task')}
                />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="pb-safe animate-slide-up">
      <h1 className="h3 fw-bold mb-4 pt-4 px-2">Insights</h1>
      
      <div className="card bg-success-subtle border-0 mb-4 rounded-4 shadow-sm">
        <div className="card-body d-flex align-items-start gap-3 p-4">
          <div className="rounded-circle bg-success text-white p-2 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm">
            <Trophy size={20} />
          </div>
          <div>
            <h6 className="fw-bold text-success-emphasis mb-1">Coach's Insight</h6>
            <p className="small text-success-emphasis mb-0 opacity-75 lh-sm">
              {insight || "Consistency is the seed of growth..."}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 rounded-4 card-hover">
             <div className="card-body p-3 d-flex align-items-center justify-content-center">
                <CompletionPieChart rate={progressPercent} label="Daily Goal" color="#6366f1" />
             </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card border-0 shadow-sm h-100 rounded-4 card-hover">
             <div className="card-body p-3 d-flex flex-column justify-content-center align-items-center text-center">
                 <div className="display-4 fw-bold text-warning mb-0">{habits.reduce((acc, h) => Math.max(acc, h.streak), 0)}</div>
                 <div className="small text-muted text-uppercase fw-bold tracking-wide" style={{ fontSize: '0.65rem' }}>Best Streak</div>
             </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4 rounded-4 card-hover">
        <div className="card-body p-4">
            <h6 className="fw-bold text-body mb-2">Weekly Rhythm</h6>
            <WeeklyProgressChart data={weeklyData} />
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="pb-safe animate-slide-up">
       <div className="card border-0 shadow-sm rounded-bottom-5 mb-4 text-center bg-body position-relative overflow-hidden">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-brand opacity-10"></div>
          {/* Increased Z-Index to 3 to ensure button is clickable above background layers */}
          <div className="position-absolute top-0 end-0 p-3 z-3">
             <button onClick={openProfileEditModal} className="btn btn-light btn-sm rounded-circle p-2 shadow-sm transition-all card-hover text-primary">
                <Pencil size={18} />
             </button>
          </div>
          <div className="card-body p-5 position-relative z-1">
              <div className="mx-auto mb-3 rounded-circle overflow-hidden border border-4 border-white shadow-lg bg-light d-flex align-items-center justify-content-center" style={{ width: '110px', height: '110px' }}>
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="User" className="w-100 h-100 object-fit-cover" />
                ) : (
                    <User size={48} className="text-secondary opacity-50" />
                )}
              </div>
              {/* Darkened text color for visibility */}
              <h2 className="display-6 fw-bolder mb-1 text-body-emphasis">{displayName}</h2>
              <p className="text-muted small fw-medium">Seedling • Level 1</p>
          </div>
       </div>

       <div className="px-3">
          <h3 className="h6 fw-bold mb-3 ms-1 text-muted text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>Achievements</h3>
          {user?.achievements.length === 0 && (
             <div className="text-center py-4 text-muted small border rounded-4 border-dashed">
                 No achievements yet. Keep growing! 🌟
             </div>
          )}
          <div className="d-flex flex-column gap-3">
            {user?.achievements.map((ach) => (
                <div key={ach.id} className="card border-0 shadow-sm rounded-4 card-hover delay-1 animate-slide-up">
                    <div className="card-body d-flex align-items-center gap-3 p-3">
                        <div className="fs-1">{ach.icon}</div>
                        <div>
                        <h4 className="h6 fw-bold mb-1">{ach.title}</h4>
                        <p className="small text-muted mb-0">{ach.description}</p>
                        </div>
                    </div>
                </div>
            ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-body-tertiary text-body">
      <main className="container-fluid min-vh-100 position-relative p-0" style={{ maxWidth: '480px' }}>
        <div className="container px-3 h-100">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'habits' && (
                <div className="pb-safe animate-slide-up">
                    <h1 className="h3 fw-bold mb-4 pt-4 px-2">All Habits</h1>
                    <div className="d-flex flex-column gap-2">
                        {habits.length === 0 && (
                             <div className="text-center py-5 border rounded-4 border-dashed">
                                 <p className="text-muted mb-0">No habits yet. Start blooming! 🌱</p>
                             </div>
                        )}
                        {habits.map((h, idx) => (
                            <div key={h.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <HabitCard 
                                    habit={h} 
                                    isCompletedToday={h.completedDates.includes(today)} 
                                    onToggle={toggleHabit} 
                                    onEdit={(h) => openEditModal(h, 'habit')}
                                    onDelete={handleDeleteHabit}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'tasks' && (
                <div className="pb-safe animate-slide-up">
                    <h1 className="h3 fw-bold mb-4 pt-4 px-2">Task List</h1>
                    <div>
                         {tasks.length === 0 && (
                            <div className="text-center py-5 border rounded-4 border-dashed">
                                <p className="text-muted mb-0">No tasks. Free mind! 🌬️</p>
                            </div>
                         )}
                         {tasks.map((t, idx) => (
                             <div key={t.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <TaskCard task={t} onToggle={toggleTask} onDelete={handleDeleteTask} onEdit={(t) => openEditModal(t, 'task')} />
                             </div>
                         ))}
                    </div>
                </div>
            )}
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'profile' && renderProfile()}
        </div>

        {/* Floating Action Button - Positioned Centered relative to App Container */}
        {(activeTab === 'home' || activeTab === 'habits' || activeTab === 'tasks') && (
            <div className="position-fixed bottom-0 w-100" style={{ maxWidth: '480px', left: '50%', transform: 'translateX(-50%)', zIndex: 1050, pointerEvents: 'none' }}>
                <div className="position-absolute bottom-0 end-0 p-4" style={{ marginBottom: '100px', pointerEvents: 'auto' }}>
                    <button 
                        onClick={() => openAddModal(activeTab === 'tasks' ? 'task' : 'habit')}
                        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center animate-pulse-ring transition-all hover-scale"
                        style={{ width: '64px', height: '64px' }}
                    >
                        <Plus size={32} />
                    </button>
                </div>
            </div>
        )}

        {/* Bottom Navigation */}
        <nav className="navbar fixed-bottom bg-body border-top shadow-lg pb-4 pt-3" style={{ maxWidth: '480px', margin: '0 auto', borderRadius: '24px 24px 0 0', zIndex: 1030 }}>
            <div className="container-fluid d-flex justify-content-center gap-2">
                <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={24} />} label="Home" />
                <NavButton active={activeTab === 'habits'} onClick={() => setActiveTab('habits')} icon={<CheckSquare size={24} />} label="Habits" />
                <NavButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart2 size={24} />} label="Stats" />
                <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={24} />} label="Profile" />
            </div>
        </nav>

        {/* Modal Overlay */}
        {isModalOpen && (
            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-60 z-50 d-flex align-items-end justify-content-center p-0 backdrop-blur-sm">
                <div className="card w-100 rounded-top-5 shadow-lg border-0 animate-slide-up" style={{ maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-center mb-4">
                             <div className="bg-secondary opacity-25 rounded-pill" style={{ width: '40px', height: '4px' }}></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0 display-6" style={{ fontSize: '1.5rem' }}>
                                {modalType === 'profile' ? 'Edit Profile' : `${editingId ? 'Edit' : 'New'} ${modalType === 'habit' ? 'Habit' : 'Task'}`}
                            </h5>
                            <div className="d-flex gap-2 align-items-center">
                                {/* Header Save Button - Enabled for all types */}
                                <button onClick={saveItem} className="btn btn-primary btn-sm rounded-pill fw-bold d-flex align-items-center gap-1 px-3">
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={closeModal} className="btn btn-light rounded-circle p-2">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {modalType !== 'profile' && !editingId && (
                            <div className="d-flex gap-2 mb-4 p-1 rounded-4 bg-body-tertiary">
                                <TabSelector label="Habit" active={modalType === 'habit'} onClick={() => setModalType('habit')} />
                                <TabSelector label="Task" active={modalType === 'task'} onClick={() => setModalType('task')} />
                            </div>
                        )}

                        <form onSubmit={saveItem} className="d-flex flex-column gap-4">
                            {modalType === 'profile' && (
                                <>
                                    <div>
                                        <label className="form-label small fw-bold text-muted text-uppercase tracking-wide mb-2">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={editUserName}
                                            onChange={(e) => setEditUserName(e.target.value)}
                                            className="form-control form-control-lg rounded-4 bg-light border-0 text-dark"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label small fw-bold text-muted text-uppercase tracking-wide mb-2">Profile Picture</label>
                                        <div className="d-flex align-items-center gap-3 p-3 border rounded-4">
                                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '56px', height: '56px' }}>
                                                 {editUserAvatar ? <img src={editUserAvatar} className="w-100 h-100 object-fit-cover" /> : <User size={24} className="text-secondary" />}
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="form-control form-control-sm border-0"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {modalType !== 'profile' && (
                                <div>
                                    <label className="form-label small fw-bold text-muted text-uppercase tracking-wide mb-2">Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="form-control form-control-lg rounded-4 bg-light border-0 text-dark"
                                        placeholder={modalType === 'habit' ? "e.g., Drink Water" : "e.g., Buy Groceries"}
                                    />
                                </div>
                            )}

                            {modalType === 'habit' && (
                               <>
                                 <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-muted text-uppercase tracking-wide mb-2">Reminder Time</label>
                                        <input 
                                            type="time" 
                                            value={newItemTime}
                                            onChange={(e) => setNewItemTime(e.target.value)}
                                            className="form-control form-control-lg rounded-4 bg-light border-0 text-dark"
                                        />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="form-label small fw-bold text-muted text-uppercase tracking-wide mb-2">Color Tag</label>
                                    <div className="d-flex gap-2 overflow-auto pb-2 no-scrollbar">
                                        {COLORS.map(c => (
                                            <button 
                                                key={c.name}
                                                type="button"
                                                onClick={() => setNewItemColor(c.value)}
                                                className={`btn rounded-circle p-0 border-0 flex-shrink-0 transition-all ${c.value} ${newItemColor === c.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110 shadow-sm' : 'opacity-75'}`}
                                                style={{ width: '40px', height: '40px' }}
                                            />
                                        ))}
                                    </div>
                                 </div>
                               </>
                            )}

                            {modalType === 'task' && (
                                <>
                                    <div>
                                        <label className="form-label small fw-bold text-muted text-uppercase tracking-wide mb-2">Description</label>
                                        <input 
                                            type="text" 
                                            value={newItemDesc}
                                            onChange={(e) => setNewItemDesc(e.target.value)}
                                            className="form-control form-control-lg rounded-4 bg-light border-0 text-dark"
                                            placeholder="Add details (optional)"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label small fw-bold text-muted text-uppercase tracking-wide mb-2">Priority</label>
                                        <div className="d-flex gap-2">
                                            {['Low', 'Medium', 'High'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setNewItemPriority(p as Priority)}
                                                    className={`btn flex-fill rounded-4 border-0 py-2 fw-medium ${newItemPriority === p ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-100 rounded-4 mt-2 fw-bold shadow-lg py-3"
                            >
                                {modalType === 'profile' ? 'Save Changes' : `${editingId ? 'Update' : 'Create'} ${modalType === 'habit' ? 'Habit' : 'Task'}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

// UI Sub-components
const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button onClick={onClick} className={`btn border-0 d-flex flex-column align-items-center justify-content-center gap-1 p-0 transition-all`} style={{ width: '70px' }}>
        <div className={`p-2 rounded-4 transition-all mb-1 ${active ? 'nav-icon-active' : 'text-secondary'}`}>
            {React.cloneElement(icon as React.ReactElement, { strokeWidth: active ? 2.5 : 2 })}
        </div>
        <span style={{ fontSize: '10px', fontWeight: active ? 600 : 500, color: active ? 'var(--bs-primary)' : 'var(--bs-secondary)' }}>{label}</span>
    </button>
);

const TabSelector = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button 
        type="button"
        className={`flex-fill btn btn-sm fw-bold rounded-3 py-2 border-0 transition-all ${active ? 'bg-white shadow-sm text-primary' : 'text-muted hover-bg-light'}`}
        onClick={onClick}
    >
        {label}
    </button>
);

export default App;