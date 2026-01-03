"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Calendar,
  Clock,
  Target,
  Dumbbell,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Edit2,
  Save,
  BarChart3,
  TrendingUp,
  Zap,
} from "lucide-react";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kanban-tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [draggedTask, setDraggedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    column: "todo",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-100" },
    { id: "inprogress", title: "In Progress", color: "bg-yellow-100" },
    { id: "done", title: "Done", color: "bg-green-100" },
  ];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTask && draggedTask.column !== columnId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggedTask.id
            ? { ...task, column: columnId }
            : task
        )
      );
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        dueDate: new Date().toISOString().split("T")[0],
      };
      setTasks((prev) => [...prev, task]);
      setNewTask({ title: "", description: "", column: "todo" });
      setShowAddForm(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? editingTask : task
        )
      );
      setEditingTask(null);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.column === "done").length;
    const inProgress = tasks.filter((t) => t.column === "inprogress").length;
    const todo = tasks.filter((t) => t.column === "todo").length;
    
    return { total, completed, inProgress, todo };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white border-4 border-black rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-black mb-2">
                Fitness Kanban Board
              </h1>
              <p className="text-black font-bold">Organize your workout journey</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-yellow-400 border-4 border-black rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-black">{stats.total}</div>
                <div className="text-xs font-black text-black">Total</div>
              </div>
              <div className="bg-gray-100 border-4 border-black rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-black">{stats.todo}</div>
                <div className="text-xs font-black text-black">To Do</div>
              </div>
              <div className="bg-yellow-100 border-4 border-black rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-black">{stats.inProgress}</div>
                <div className="text-xs font-black text-black">In Progress</div>
              </div>
              <div className="bg-green-100 border-4 border-black rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-black">{stats.completed}</div>
                <div className="text-xs font-black text-black">Done</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-yellow-400 border-4 border-black text-black font-black py-3 px-6 rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-white border-4 border-black rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-black">{column.title}</h2>
                <div className="bg-black text-white text-xs font-black px-2 py-1 rounded-lg">
                  {tasks.filter((t) => t.column === column.id).length}
                </div>
              </div>
              
              <div
                className="min-h-[400px] space-y-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {tasks.length === 0 && column.id === "todo" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target size={24} className="text-black" />
                    </div>
                    <p className="text-black font-bold">No tasks yet</p>
                    <p className="text-black text-sm mt-2">Add your first task to get started!</p>
                  </div>
                )}
                
                <AnimatePresence>
                  {tasks
                    .filter((task) => task.column === column.id)
                    .map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`bg-yellow-400 border-4 border-black rounded-xl p-4 cursor-move hover:shadow-xl transition-all ${
                          draggedTask?.id === task.id ? "opacity-50 scale-95" : "hover:scale-105"
                        }`}
                      >
                        {editingTask?.id === task.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingTask.title}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, title: e.target.value })
                              }
                              className="w-full px-3 py-2 border-2 border-black rounded-lg text-black font-bold"
                            />
                            <textarea
                              value={editingTask.description}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, description: e.target.value })
                              }
                              className="w-full px-3 py-2 border-2 border-black rounded-lg text-black font-bold resize-none"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveEdit}
                                className="bg-black text-white px-3 py-1 rounded-lg border-2 border-black font-black text-sm hover:shadow-xl"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => setEditingTask(null)}
                                className="bg-white text-black px-3 py-1 rounded-lg border-2 border-black font-black text-sm hover:shadow-xl"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-black text-black text-lg">{task.title}</h3>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="text-black hover:text-yellow-600 transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-black hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-black font-bold text-sm mb-3">{task.description}</p>
                            <div className="flex items-center gap-1 text-xs font-black text-black">
                              <Calendar size={12} />
                              {task.dueDate}
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-black rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-black">Add New Task</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-black hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border-4 border-black rounded-lg text-black font-bold placeholder-gray-400"
                />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border-4 border-black rounded-lg text-black font-bold placeholder-gray-400 resize-none"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 bg-yellow-400 border-4 border-black text-black font-black py-3 rounded-xl hover:shadow-xl transition-all"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-white border-4 border-black text-black font-black py-3 rounded-xl hover:shadow-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KanbanBoard;