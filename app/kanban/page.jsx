"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  GripVertical,
  Trash2,
  Layout,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const columns = [
  {
    key: "todo",
    title: "To Do",
    icon: Layout,
    borderColor: "border-cyan-400",
    columnBg: "bg-cyan-950/40",
    cardBg: "bg-[#082f49]",
    btnBg: "bg-cyan-400",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
    accentText: "text-cyan-400",
  },
  {
    key: "progress",
    title: "In Progress",
    icon: Calendar,
    borderColor: "border-fuchsia-500",
    columnBg: "bg-fuchsia-950/40",
    cardBg: "bg-[#4c1d95]",
    btnBg: "bg-fuchsia-500",
    glow: "shadow-[0_0_15px_rgba(217,70,239,0.3)]",
    accentText: "text-fuchsia-400",
  },
  {
    key: "done",
    title: "Done",
    icon: CheckCircle2,
    borderColor: "border-emerald-400",
    columnBg: "bg-emerald-950/40",
    cardBg: "bg-[#064e3b]",
    btnBg: "bg-emerald-400",
    glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    accentText: "text-emerald-400",
  },
];

const TAGS = [
  { name: "Organize", color: "bg-cyan-500/10 text-cyan-300 border-cyan-400" },
  {
    name: "Plan",
    color: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-400",
  },
  {
    name: "Note",
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-400",
  },
];

export default function NeonKanban() {
  // Initialize with empty columns
  const [data, setData] = useState({ todo: [], progress: [], done: [] });
  const [dragging, setDragging] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");

  // 1. Load data from Local Storage on startup
  useEffect(() => {
    const savedData = localStorage.getItem("neon-kanban-tasks");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // 2. Save data to Local Storage whenever 'data' changes
  useEffect(() => {
    localStorage.setItem("neon-kanban-tasks", JSON.stringify(data));
  }, [data]);

  const addTask = () => {
    if (!taskTitle.trim()) return;
    setData((prev) => ({
      ...prev,
      [activeColumn]: [
        ...prev[activeColumn],
        { id: crypto.randomUUID(), title: taskTitle },
      ],
    }));
    setTaskTitle("");
    setModalOpen(false);
  };

  const deleteTask = (col, id) => {
    setData((prev) => ({
      ...prev,
      [col]: prev[col].filter((i) => i.id !== id),
    }));
  };

  const onDrop = (columnKey) => {
    if (!dragging) return;
    setData((prev) => {
      if (dragging.column === columnKey) return prev;
      return {
        ...prev,
        [dragging.column]: prev[dragging.column].filter(
          (i) => i.id !== dragging.item.id,
        ),
        [columnKey]: [...prev[columnKey], dragging.item],
      };
    });
    setDragging(null);
  };

  return (
    <div
      className="w-full flex flex-col items-center bg-[#0a0f1d] text-white font-sans overflow-hidden relative shadow-[inset_0_0_100px_rgba(59,130,246,0.1)]"
      style={{
        height: "93.5vh",
        backgroundImage:
          "radial-gradient(circle at 20% 40%, rgba(39, 77, 201, 0.74), transparent 60%), radial-gradient(circle at 70% 60%, rgba(49, 198, 146, 0.51), transparent 60%)",
      }}
    >
      {/* HEADER */}
      <header className="w-full max-w-6xl px-8 pt-8 pb-4 shrink-0 flex flex-col items-center text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
          Kanban Board
        </h1>
        <div className="flex gap-2 flex-wrap justify-center">
          {TAGS.map((tag) => (
            <span
              key={tag.name}
              className={`px-3 py-1 border rounded-none ${tag.color} text-[10px] font-black uppercase tracking-widest`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </header>

      {/* BOARD SECTION */}
      <main
        className="w-full max-w-7xl flex gap-4 px-8 pb-4 overflow-hidden justify-center"
        style={{ height: "calc(100vh - 180px)" }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col.key)}
            className={`flex-1 flex flex-col border-2 ${col.borderColor} ${col.glow} ${col.columnBg} overflow-hidden rounded-none shadow-xl`}
          >
            {/* COLUMN HEADER */}
            <div
              className={`p-4 flex items-center justify-between border-b-2 ${col.borderColor} bg-black/40 backdrop-blur-md`}
            >
              <div className="flex items-center gap-3">
                <col.icon size={20} className={col.accentText} />
                <h2 className="font-black text-sm uppercase tracking-tighter italic">
                  {col.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveColumn(col.key);
                  setModalOpen(true);
                }}
                className={`p-1 rounded-none text-black font-black ${col.btnBg} hover:brightness-110 active:scale-95 transition-all`}
              >
                <Plus size={18} strokeWidth={4} />
              </button>
            </div>

            {/* CARDS SECTION */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {data[col.key].map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    draggable
                    onDragStart={() => setDragging({ item, column: col.key })}
                    className={`border border-white/10 ${col.cardBg} p-4 rounded-none flex flex-col cursor-grab active:cursor-grabbing hover:border-white/40 transition-all group`}
                  >
                    <div className="flex gap-3 items-start justify-between">
                      <div className="flex gap-3 items-start">
                        <GripVertical
                          size={16}
                          className={`${col.accentText} opacity-30 mt-1 shrink-0`}
                        />
                        <p className="text-[14px] font-bold text-white leading-snug uppercase tracking-tight">
                          {item.title}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteTask(col.key, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`relative bg-[#0f172a] border-2 ${columns.find((c) => c.key === activeColumn)?.borderColor} w-full max-w-sm p-8 rounded-none`}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                  New Task
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-white hover:opacity-50 transition-opacity"
                >
                  <X size={24} />
                </button>
              </div>

              <input
                autoFocus
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Task title..."
                className="w-full border-b border-white/20 bg-transparent rounded-none px-0 py-2 text-lg font-bold outline-none focus:border-white transition-all mb-8 placeholder:text-white/60 text-white"
              />

              <button
                onClick={addTask}
                className={`w-full py-3 text-sm font-black uppercase tracking-widest text-black rounded-none ${columns.find((c) => c.key === activeColumn)?.btnBg}`}
              >
                Create
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
