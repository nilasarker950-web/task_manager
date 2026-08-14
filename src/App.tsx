import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { TaskStats } from './components/TaskStats';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { UserModal } from './components/UserModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Task, TaskStatus, FilterStatus, SortOption } from './types';
import { useAuth, AuthProvider } from './context/AuthContext';
import {
  subscribeToUserTasks,
  createCloudTask,
  updateCloudTask,
  deleteCloudTask,
} from './services/taskService';
import {
  Plus,
  RotateCcw,
  CheckCircle2,
  Inbox,
  Sparkles,
  Cloud,
  Check,
  Flame,
  LogIn,
  Loader2,
  AlertCircle,
  Database,
  Layers,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function TaskManagerContent() {
  const { currentUser, firebaseUser, loading, isOnline, signInWithGoogle, signInAsGuest } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('deadline_asc');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
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
  }, [firebaseUser, isTaskModalOpen, isUserModalOpen]);

  // Real-time Firestore sync via onSnapshot
  useEffect(() => {
    if (!firebaseUser?.uid) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);
    setFirestoreError(null);

    const unsubscribe = subscribeToUserTasks(
      firebaseUser.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setTasksLoading(false);
      },
      (error) => {
        console.error('Task sync error:', error);
        setFirestoreError('Failed to sync tasks with Firestore database.');
        setTasksLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser?.uid]);

  // Handle Add or Update Task in Firestore
  const handleSaveTask = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
    taskId?: string
  ) => {
    if (!firebaseUser) {
      showToast('Please sign in first to save tasks');
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
        showToast('Task updated in Cloud Firestore');
      } else {
        await createCloudTask(firebaseUser.uid, {
          taskName: taskData.taskName,
          description: taskData.description,
          deadline: taskData.deadline,
          status: taskData.status,
          userEmail: firebaseUser.email || undefined,
          userName: firebaseUser.displayName || undefined,
        });
        showToast('Task added to Cloud Firestore');
      }
    } catch (err: any) {
      console.error('Error saving task:', err);
      showToast('Error saving task to Firestore');
    }
  };

  // Toggle Task Status (Pending <-> Completed) in Firestore
  const handleToggleStatus = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const newStatus: TaskStatus = target.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await updateCloudTask(taskId, { status: newStatus });
      showToast(`Marked as ${newStatus}`);
    } catch (err) {
      console.error('Error toggling status:', err);
      showToast('Error updating status in cloud');
    }
  };

  // Delete Task from Firestore
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteCloudTask(deletingTask.id);
      showToast(`Deleted "${deletingTask.taskName}"`);
      setDeletingTask(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Error deleting task from cloud');
    }
  };

  // Seed sample mini project tasks to Firestore
  const handleSeedDemoTasks = async () => {
    if (!firebaseUser) return;
    try {
      const d1 = new Date();
      d1.setDate(d1.getDate() + 2);
      d1.setHours(18, 0, 0, 0);

      const d2 = new Date();
      d2.setDate(d2.getDate() + 5);
      d2.setHours(12, 0, 0, 0);

      const d3 = new Date();
      d3.setDate(d3.getDate() - 1);
      d3.setHours(20, 0, 0, 0);

      await createCloudTask(firebaseUser.uid, {
        taskName: 'Deploy Firestore Security Rules',
        description: 'Enforce ABAC Zero-Trust security rules with document validation helpers and user ID matching.',
        deadline: d1.toISOString(),
        status: 'Completed',
        userEmail: firebaseUser.email || undefined,
        userName: firebaseUser.displayName || undefined,
      });

      await createCloudTask(firebaseUser.uid, {
        taskName: 'Implement Cloud Authentication Flow',
        description: 'Integrate Google Login & Anonymous Authentication with real-time onAuthStateChanged listeners.',
        deadline: d2.toISOString(),
        status: 'Pending',
        userEmail: firebaseUser.email || undefined,
        userName: firebaseUser.displayName || undefined,
      });

      await createCloudTask(firebaseUser.uid, {
        taskName: 'Submit Cloud Mini Project Report',
        description: 'Document cloud architecture diagram, Firestore database structure, and deployment metrics.',
        deadline: d3.toISOString(),
        status: 'Pending',
        userEmail: firebaseUser.email || undefined,
        userName: firebaseUser.displayName || undefined,
      });

      showToast('Sample cloud tasks seeded to Firestore');
    } catch (err) {
      console.error('Error seeding demo tasks:', err);
      showToast('Failed to seed demo tasks');
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
      all: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    }),
    [tasks]
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenNewTaskModal={() => {
          if (!firebaseUser) {
            setIsUserModalOpen(true);
            return;
          }
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        isOnline={isOnline}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Project Overview Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Cloud Task Lifecycle Dashboard
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Persistent state engine powered by Google Cloud Firestore with real-time reactive sync.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {firebaseUser && tasks.length === 0 && (
              <button
                id="seed-demo-tasks-btn"
                onClick={handleSeedDemoTasks}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
                title="Populate sample mini project tasks in Firestore"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Seed Sample Tasks</span>
              </button>
            )}
          </div>
        </div>

        {/* Firestore error banner if any */}
        {firestoreError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{firestoreError}</span>
          </div>
        )}

        {/* Auth State Guard */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-semibold text-slate-600">Connecting to Firebase Firestore...</p>
          </div>
        ) : !firebaseUser ? (
          /* Unauthenticated Landing */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto shadow-sm my-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-2xs">
              <Flame className="w-7 h-7 fill-amber-500 text-amber-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1.5">
              Sign In to Cloud Task Manager
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Connect to your Firestore account to create, manage, and track tasks with real-time cloud synchronization.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                id="landing-google-signin-btn"
                onClick={() => signInWithGoogle()}
                className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>

              <button
                id="landing-guest-signin-btn"
                onClick={() => signInAsGuest()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Instant Guest Mode</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <>
            {/* Task Statistics */}
            <TaskStats
              tasks={tasks}
              activeFilter={activeFilter}
              onSelectFilter={(filter) => setActiveFilter(filter)}
            />

            {/* Filter, Search & Sort Bar */}
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
              <div className="py-14 flex flex-col items-center justify-center text-slate-400 gap-2.5">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <p className="text-xs font-medium text-slate-500">Syncing tasks from Firestore...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedTasks.length > 0 ? (
                    filteredAndSortedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
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
                      className="bg-white rounded-2xl border border-dashed border-slate-200/90 p-12 text-center shadow-2xs"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-100/80 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">
                        No tasks found
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                        {searchQuery
                          ? `No tasks matching "${searchQuery}". Clear your search query or reset filter.`
                          : activeFilter !== 'All'
                          ? `You don't have any ${activeFilter.toLowerCase()} tasks in this view.`
                          : 'Get started by creating your first task on Cloud Firestore.'}
                      </p>
                      {searchQuery || activeFilter !== 'All' ? (
                        <button
                          id="clear-filters-btn"
                          onClick={() => {
                            setSearchQuery('');
                            setActiveFilter('All');
                          }}
                          className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Create Task</span>
                          </button>
                          <button
                            id="empty-state-seed-btn"
                            onClick={handleSeedDemoTasks}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Add Sample Tasks</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-medium text-slate-700">Cloud Computing Mini Project</span>
            <span className="text-slate-300">&bull;</span>
            <span>Firebase Firestore Backend</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>Press 'N' for New Task</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        task={deletingTask}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg shadow-slate-900/10 border border-slate-800"
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
    <AuthProvider>
      <TaskManagerContent />
    </AuthProvider>
  );
}
