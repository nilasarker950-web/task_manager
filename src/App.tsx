import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TaskStats } from './components/TaskStats';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { UserModal } from './components/UserModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AuthPage } from './components/AuthPage';
import { BrandLogo } from './components/BrandLogo';
import { Task, TaskStatus, FilterStatus, SortOption } from './types';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import {
  subscribeToUserTasks,
  createCloudTask,
  updateCloudTask,
  deleteCloudTask,
} from './services/taskService';
import {
  Plus,
  Inbox,
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function TaskManagerContent() {
  const { currentUser, firebaseUser, loading, isOnline } = useAuth();
  const { theme, isDark, themeConfig } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('deadline_asc');

  // Sidebar Drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Keyboard shortcut listener ('N' to create new task if not in input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        !isTaskModalOpen &&
        !isUserModalOpen &&
        !isThemeModalOpen &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        if (firebaseUser) {
          e.preventDefault();
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [firebaseUser, isTaskModalOpen, isUserModalOpen, isThemeModalOpen]);

  // Real-time Cloud Sync
  useEffect(() => {
    if (!firebaseUser?.uid) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);
    setSyncError(null);

    const unsubscribe = subscribeToUserTasks(
      firebaseUser.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setTasksLoading(false);
      },
      (error) => {
        console.error('Task sync error:', error);
        setSyncError('Unable to synchronize workspace state in real-time.');
        setTasksLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser?.uid]);

  // Handle Add or Update Task
  const handleSaveTask = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
    taskId?: string
  ) => {
    if (!firebaseUser) {
      showToast('Please sign in to save tasks');
      setIsUserModalOpen(true);
      return;
    }

    try {
      if (taskId) {
        await updateCloudTask(taskId, {
          taskName: taskData.taskName,
          description: taskData.description,
          deadline: taskData.deadline,
          status: taskData.status,
        });
        showToast('Task updated successfully');
      } else {
        await createCloudTask(firebaseUser.uid, {
          taskName: taskData.taskName,
          description: taskData.description,
          deadline: taskData.deadline,
          status: taskData.status,
          userEmail: firebaseUser.email || undefined,
          userName: firebaseUser.displayName || undefined,
        });
        showToast('Task created successfully');
      }
    } catch (err: any) {
      console.error('Error saving task:', err);
      showToast('Failed to save task');
    }
  };

  // Toggle Task Status (Pending <-> Completed)
  const handleToggleStatus = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const newStatus: TaskStatus = target.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await updateCloudTask(taskId, { status: newStatus });
      showToast(`Task marked as ${newStatus}`);
    } catch (err) {
      console.error('Error toggling status:', err);
      showToast('Error updating task status');
    }
  };

  // Delete Task
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteCloudTask(deletingTask.id);
      showToast(`Removed "${deletingTask.taskName}"`);
      setDeletingTask(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Error removing task');
    }
  };

  // Seed sample high-value tasks
  const handleSeedDemoTasks = async () => {
    if (!firebaseUser) return;
    try {
      const d1 = new Date();
      d1.setDate(d1.getDate() + 1);
      d1.setHours(17, 0, 0, 0);

      const d2 = new Date();
      d2.setDate(d2.getDate() + 3);
      d2.setHours(12, 0, 0, 0);

      const d3 = new Date();
      d3.setDate(d3.getDate() - 1);
      d3.setHours(18, 0, 0, 0);

      await createCloudTask(firebaseUser.uid, {
        taskName: 'Review Enterprise Product Strategy',
        description: 'Audit core milestones, resource allocation, and prioritize upcoming Q3 deliverables with team leads.',
        deadline: d1.toISOString(),
        status: 'Completed',
        userEmail: firebaseUser.email || undefined,
        userName: firebaseUser.displayName || undefined,
      });

      await createCloudTask(firebaseUser.uid, {
        taskName: 'Security Hardening & Token Auditing',
        description: 'Review role-based access control, cryptographic key rotation, and session isolation workflows.',
        deadline: d2.toISOString(),
        status: 'Pending',
        userEmail: firebaseUser.email || undefined,
        userName: firebaseUser.displayName || undefined,
      });

      await createCloudTask(firebaseUser.uid, {
        taskName: 'Prepare Executive Performance Deck',
        description: 'Compile productivity metrics, cycle times, and operational milestone summaries for stakeholders.',
        deadline: d3.toISOString(),
        status: 'Pending',
        userEmail: firebaseUser.email || undefined,
        userName: firebaseUser.displayName || undefined,
      });

      showToast('Sample tasks loaded');
    } catch (err) {
      console.error('Error seeding demo tasks:', err);
      showToast('Failed to load sample tasks');
    }
  };

  // Filter and Sort Tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (activeFilter !== 'All') {
      result = result.filter((t) => t.status === activeFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.taskName.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'deadline_asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortOption === 'deadline_desc') {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      }
      if (sortOption === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'name_asc') {
        return a.taskName.localeCompare(b.taskName);
      }
      return 0;
    });

    return result;
  }, [tasks, activeFilter, searchQuery, sortOption]);

  const counts = useMemo(
    () => ({
      total: tasks.length,
      all: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    }),
    [tasks]
  );

  // Background Canvas Dynamic Class
  const canvasBgClass =
    theme === 'midnight'
      ? 'bg-canvas-midnight text-slate-100'
      : theme === 'warm'
      ? 'bg-canvas-warm text-slate-800'
      : theme === 'emerald'
      ? 'bg-canvas-emerald text-slate-800'
      : theme === 'minimal'
      ? 'bg-canvas-minimal text-slate-900'
      : 'bg-canvas-slate text-slate-900';

  // 1. Initial Authentication Loading State
  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] ${canvasBgClass}`}>
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-xs font-semibold mt-3 text-slate-600 dark:text-slate-300">
          Connecting to secure workspace...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State: Dedicated Login & Registration Page ONLY
  if (!currentUser) {
    return <AuthPage />;
  }

  // 3. Authenticated State: Full Workspace
  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${canvasBgClass}`}>
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenNewTaskModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isOnline={isOnline}
      />

      {/* Main Layout Container (Sidebar + Content Workspace) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Workspace Sidebar Drawer (Strictly Sticky and Fixed) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          tasks={tasks}
          activeFilter={activeFilter}
          onSelectFilter={(filter) => setActiveFilter(filter)}
          currentUser={currentUser}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onOpenNewTaskModal={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          isOnline={isOnline}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Cloud sync error banner */}
          {syncError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{syncError}</span>
            </div>
          )}

          {/* Task Metrics */}
          <TaskStats
            tasks={tasks}
            activeFilter={activeFilter}
            onSelectFilter={(filter) => setActiveFilter(filter)}
          />

          {/* Filter, Search & Sort Control Bar */}
          <TaskFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={activeFilter}
            onStatusFilterChange={setActiveFilter}
            sortOption={sortOption}
            onSortOptionChange={setSortOption}
            counts={counts}
          />

          {/* Task List Section */}
          {tasksLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2.5">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Synchronizing workspace tasks...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedTasks.length > 0 ? (
                  filteredAndSortedTasks.map((task, idx) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={idx}
                      onToggleStatus={handleToggleStatus}
                      onEditTask={(t) => {
                        setEditingTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      onDeleteTask={(t) => setDeletingTask(t)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-2xl border border-dashed p-12 text-center shadow-2xs ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                        : 'bg-white border-slate-200/90 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                        isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100/80 text-slate-400'
                      }`}
                    >
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold mb-1">
                      No tasks in this view
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                      {searchQuery
                        ? `No tasks matching "${searchQuery}". Clear your search query or reset filter.`
                        : activeFilter !== 'All'
                        ? `You don't have any ${activeFilter.toLowerCase()} tasks in this category.`
                        : 'Get started by creating your first task in this workspace.'}
                    </p>
                    {searchQuery || activeFilter !== 'All' ? (
                      <button
                        id="clear-filters-btn"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveFilter('All');
                        }}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer ${
                          isDark
                            ? 'text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-800'
                            : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                        }`}
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2.5">
                        <button
                          id="empty-state-add-task-btn"
                          onClick={() => {
                            setEditingTask(null);
                            setIsTaskModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create Task</span>
                        </button>
                        <button
                          id="empty-state-seed-btn"
                          onClick={handleSeedDemoTasks}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs active:scale-95 cursor-pointer ${
                            isDark
                              ? 'text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700'
                              : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                          <span>Load Sample Tasks</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Clean & Polished Minimal Footer */}
      <footer
        className={`border-t py-4 mt-auto transition-colors duration-200 ${
          isDark
            ? 'border-slate-800 bg-slate-900/90 text-slate-400'
            : 'border-slate-200/80 bg-white text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" showLabel={true} badgeText="WORKSPACE" />
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium opacity-80">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme: {themeConfig.name}</span>
            </button>
            <span className="hidden sm:inline font-mono opacity-60">Press 'N' for New Task</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        taskCount={counts}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        task={deletingTask}
      />

      {/* Floating Toast Notification with Spring Motion */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700/80"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskManagerContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
