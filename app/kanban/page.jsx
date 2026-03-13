"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
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
import { supabase } from "@/lib/supabaseClient";

// ============================================
// CONFIGURATION
// ============================================
const config = {
  colors: {
    bgPrimary: "#051061",
    bgDark: "#020a21",
    accent: "#1AF0BE",
    textPrimary: "#ffffff",
    textOnAccent: "#051061",
  },
};

const columns = [
  { key: "todo", title: "To Do", icon: Layout },
  { key: "progress", title: "In Progress", icon: Calendar },
  { key: "done", title: "Done", icon: CheckCircle2 },
];

const TAGS = [{ name: "Organize" }, { name: "Plan" }, { name: "Note" }];

const LS_KEY = "notrainer-kanban-tasks";

function emptyBoard() {
  return { todo: [], progress: [], done: [] };
}

function groupByStatus(rows) {
  const board = emptyBoard();
  for (const r of rows) {
    if (board[r.status]) board[r.status].push({ id: r.id, title: r.title });
  }
  return board;
}

export default function KanbanPage() {
  const [data, setData] = useState(emptyBoard());
  const [dragging, setDragging] = useState(null);

  // Refs for mobile drag
  const mainRef = useRef(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef(null);
  const [isDragReady, setIsDragReady] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");

  const [session, setSession] = useState(null);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudError, setCloudError] = useState("");

  const userId = session?.user?.id ?? null;

  // AUTH STATE
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession ?? null),
    );
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // LOAD DATA
  useEffect(() => {
    const run = async () => {
      setCloudError("");
      if (!userId) {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) setData(JSON.parse(saved));
        else setData(emptyBoard());
        return;
      }
      setLoadingCloud(true);
      try {
        const { data: rows, error } = await supabase
          .from("kanban_tasks")
          .select("id,title,status,created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setData(groupByStatus(rows ?? []));
      } catch (e) {
        console.error(e);
        setCloudError("Could not load data.");
      } finally {
        setLoadingCloud(false);
      }
    };
    run();
  }, [userId]);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    if (!userId) localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data, userId]);

  const activeColMeta = useMemo(
    () => columns.find((c) => c.key === activeColumn),
    [activeColumn],
  );

  // SUPABASE HELPERS
  const insertSupabaseTask = async ({ title, status }) => {
    const { data: rows, error } = await supabase
      .from("kanban_tasks")
      .insert([{ user_id: userId, title, status }])
      .select("id,title,status")
      .limit(1);
    if (error) throw error;
    return rows?.[0];
  };

  const deleteSupabaseTask = async (id) => {
    const { error } = await supabase
      .from("kanban_tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
  };

  const updateSupabaseStatus = async (id, status) => {
    const { error } = await supabase
      .from("kanban_tasks")
      .update({ status })
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
  };

  // ACTIONS
  const addTask = async () => {
    if (!taskTitle.trim() || !activeColumn) return;
    const title = taskTitle.trim();
    const optimistic = { id: crypto.randomUUID(), title };
    setData((prev) => ({
      ...prev,
      [activeColumn]: [...prev[activeColumn], optimistic],
    }));
    setTaskTitle("");
    setModalOpen(false);
    if (userId) {
      try {
        const created = await insertSupabaseTask({
          title,
          status: activeColumn,
        });
        if (created?.id) {
          setData((prev) => ({
            ...prev,
            [activeColumn]: prev[activeColumn].map((t) =>
              t.id === optimistic.id
                ? { id: created.id, title: created.title }
                : t,
            ),
          }));
        }
      } catch (e) {
        console.error(e);
        setCloudError("Insert failed.");
      }
    }
  };

  const deleteTask = async (col, id) => {
    setData((prev) => ({
      ...prev,
      [col]: prev[col].filter((i) => i.id !== id),
    }));
    if (userId) {
      try {
        await deleteSupabaseTask(id);
      } catch (e) {
        console.error(e);
        setCloudError("Delete failed.");
      }
    }
  };

  // ============================================
  // DRAG & DROP LOGIC
  // ============================================

  const onDrop = async (columnKey) => {
    if (!dragging) return;
    if (dragging.column === columnKey) {
      setDragging(null);
      setIsDragReady(false);
      return;
    }
    const movedItem = dragging.item;
    const fromCol = dragging.column;
    setData((prev) => ({
      ...prev,
      [fromCol]: prev[fromCol].filter((i) => i.id !== movedItem.id),
      [columnKey]: [...prev[columnKey], movedItem],
    }));
    setDragging(null);
    setIsDragReady(false);

    if (userId) {
      try {
        await updateSupabaseStatus(movedItem.id, columnKey);
      } catch (e) {
        console.error(e);
        setCloudError("Move failed.");
      }
    }
  };

  // --- Desktop Handlers ---
  const handleDragStart = (e, item, colKey) => {
    setDragging({ item, column: colKey });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // --- Mobile Handlers (Long Press) ---

  const handleTouchStart = (e, item, colKey) => {
    longPressTimer.current = setTimeout(() => {
      setDragging({ item, column: colKey });
      setIsDragReady(true);
    }, 300);
  };

  const handleTouchMove = (e) => {
    if (longPressTimer.current && !isDragReady) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      return;
    }

    if (!dragging) return;

    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });

    if (mainRef.current) {
      const rect = mainRef.current.getBoundingClientRect();
      const scrollThreshold = 60;
      const scrollSpeed = 10;

      if (touch.clientY < rect.top + scrollThreshold) {
        mainRef.current.scrollTop -= scrollSpeed;
      } else if (touch.clientY > rect.bottom - scrollThreshold) {
        mainRef.current.scrollTop += scrollSpeed;
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!dragging) return;

    const dropTarget = document.elementFromPoint(touchPos.x, touchPos.y);
    const columnElement = dropTarget?.closest("[data-column-key]");

    if (columnElement) {
      const targetKey = columnElement.getAttribute("data-column-key");
      if (targetKey) {
        onDrop(targetKey);
      }
    } else {
      setDragging(null);
      setIsDragReady(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .kanban-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .kanban-scroll::-webkit-scrollbar-thumb {
          background: rgba(26, 240, 190, 0.3);
        }
        .kanban-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      <div
        className="relative flex w-full flex-col items-center overflow-hidden font-sans selection:bg-[#1AF0BE] selection:text-[#051061] h-[calc(100dvh-40px)] md:h-[calc(100dvh-48px)]"
        style={{ backgroundColor: config.colors.bgPrimary }}
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] bg-[#051061] blur-[140px]}" />
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[-10%] h-[550px] w-[550px] bg-[#1AF0BE] blur-[130px] opacity-20"
          />
        </div>

        {/* Header */}
        <header className="relative z-10 w-full max-w-6xl px-6 pt-8 pb-4 text-center md:pt-10 md:pb-6 shrink-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl"
            style={{ fontFamily: "'Krona One', sans-serif" }}
          >
            Kanban <span className="text-[#1AF0BE]">Board</span>
          </motion.h1>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag.name}
                className="px-3 py-1 border border-[#1AF0BE]/40 bg-[#1AF0BE]/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#1AF0BE]"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
            Mode:{" "}
            <span className="text-[#1AF0BE]">
              {userId ? "Cloud Sync" : "Local Storage"}
            </span>
            {loadingCloud && (
              <span className="ml-2 animate-pulse text-[#1AF0BE]">
                Syncing...
              </span>
            )}
          </div>

          {/* Instruction Hint for Mobile */}
          <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 md:hidden">
            Hold card to drag
          </div>

          {cloudError && (
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-red-400">
              {cloudError}
            </div>
          )}
        </header>

        {/* Main Grid Container */}
        <main
          ref={mainRef}
          className="relative z-10 grid w-full max-w-6xl flex-1 min-h-0 grid-rows-3 gap-3 overflow-auto px-4 pb-6 md:grid-cols-3 md:grid-rows-1 md:gap-4 md:px-6 no-scrollbar"
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {columns.map((col, index) => (
            <motion.div
              key={col.key}
              data-column-key={col.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onDragOver={handleDragOver}
              onDrop={() => onDrop(col.key)}
              className="flex flex-col border-l-4 bg-[#020a21]/60 backdrop-blur-sm"
              style={{ borderColor: config.colors.accent }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 shrink-0">
                <div className="flex items-center gap-3">
                  <col.icon size={18} className="text-[#1AF0BE]" />
                  <h2 className="text-sm font-black uppercase tracking-tight text-white">
                    {col.title}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setActiveColumn(col.key);
                    setModalOpen(true);
                  }}
                  className="flex h-7 w-7 items-center justify-center bg-[#1AF0BE] text-[#051061] transition-transform hover:scale-110 active:scale-95"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              {/* Cards Container */}
              <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-3 kanban-scroll">
                <AnimatePresence mode="popLayout">
                  {data[col.key].length === 0 && (
                    <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-widest text-white/20 md:hidden">
                      Drop here
                    </div>
                  )}
                  {data[col.key].map((item) => {
                    const isThisDragging =
                      dragging?.item.id === item.id && isDragReady;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: isThisDragging ? 0.3 : 1,
                          scale: 1,
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item, col.key)}
                        onTouchStart={(e) => handleTouchStart(e, item, col.key)}
                        className={`group cursor-grab border bg-[#112B8A] p-4 active:cursor-grabbing transition-all
                          ${isThisDragging ? "border-[#1AF0BE] opacity-30" : "border-white/10 hover:border-[#1AF0BE]/40"}
                        `}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <GripVertical
                              size={16}
                              className="mt-0.5 shrink-0 text-[#1AF0BE]/40"
                            />
                            <p className="text-sm font-bold uppercase leading-snug tracking-tight text-white">
                              {item.title}
                            </p>
                          </div>

                          {/* DELETE BUTTON: Visible on mobile, hover on desktop */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering drag/touch logic
                              deleteTask(col.key, item.id);
                            }}
                            className="text-white/40 hover:text-red-400 transition-colors md:opacity-0 md:group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </main>

        {/* Floating Ghost Element for Mobile Drag */}
        {dragging && isDragReady && (
          <div
            className="fixed z-[100] pointer-events-none w-[200px] p-4 border-2 border-[#1AF0BE] bg-[#051061] text-white font-bold uppercase text-sm shadow-[0_0_20px_rgba(26,240,190,0.4)]"
            style={{
              left: touchPos.x - 100,
              top: touchPos.y - 30,
              transform: "rotate(2deg)",
            }}
          >
            {dragging.item.title}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-sm overflow-hidden bg-[#1AF0BE] p-8 text-[#051061] shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-[#051061]" />
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    New Task
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-[#051061]/60 transition-colors hover:text-[#051061]"
                  >
                    <X size={24} strokeWidth={3} />
                  </button>
                </div>
                <input
                  autoFocus
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="Task title..."
                  className="w-full border-b-2 border-[#051061]/30 bg-transparent py-3 text-lg font-bold placeholder:text-[#051061]/40 focus:border-[#051061] focus:outline-none"
                />
                <button
                  onClick={addTask}
                  className="mt-8 w-full bg-[#051061] py-3 text-sm font-black uppercase tracking-[0.2em] text-[#1AF0BE] transition-all hover:bg-[#020a21] active:scale-95"
                >
                  Create Task
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
