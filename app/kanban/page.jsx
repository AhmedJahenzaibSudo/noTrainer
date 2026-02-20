"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  { name: "Plan", color: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-400" },
  { name: "Note", color: "bg-emerald-500/10 text-emerald-300 border-emerald-400" },
];

const LS_KEY = "neon-kanban-tasks";

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

export default function NeonKanban() {
  const [data, setData] = useState(emptyBoard());
  const [dragging, setDragging] = useState(null);

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

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) =>
      setSession(newSession ?? null),
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

      // Logged out -> localStorage
      if (!userId) {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) setData(JSON.parse(saved));
        else setData(emptyBoard());
        return;
      }

      // Logged in -> Supabase
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
        setCloudError("Could not load from Supabase (check table + RLS).");
      } finally {
        setLoadingCloud(false);
      }
    };

    run();
  }, [userId]);

  // SAVE TO LOCAL STORAGE only when logged out
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

    // Optimistic UI
    setData((prev) => ({
      ...prev,
      [activeColumn]: [...prev[activeColumn], optimistic],
    }));

    setTaskTitle("");
    setModalOpen(false);

    // If logged in, also insert into Supabase and swap ID
    if (userId) {
      try {
        const created = await insertSupabaseTask({ title, status: activeColumn });
        if (created?.id) {
          setData((prev) => ({
            ...prev,
            [activeColumn]: prev[activeColumn].map((t) =>
              t.id === optimistic.id ? { id: created.id, title: created.title } : t,
            ),
          }));
        }
      } catch (e) {
        console.error(e);
        setCloudError("Insert failed (Supabase).");
      }
    }
  };

  const deleteTask = async (col, id) => {
    // Optimistic
    setData((prev) => ({
      ...prev,
      [col]: prev[col].filter((i) => i.id !== id),
    }));

    if (userId) {
      try {
        await deleteSupabaseTask(id);
      } catch (e) {
        console.error(e);
        setCloudError("Delete failed (Supabase).");
      }
    }
  };

  const onDrop = async (columnKey) => {
    if (!dragging) return;

    if (dragging.column === columnKey) {
      setDragging(null);
      return;
    }

    const movedItem = dragging.item;
    const fromCol = dragging.column;

    // Optimistic UI move
    setData((prev) => ({
      ...prev,
      [fromCol]: prev[fromCol].filter((i) => i.id !== movedItem.id),
      [columnKey]: [...prev[columnKey], movedItem],
    }));
    setDragging(null);

    if (userId) {
      try {
        await updateSupabaseStatus(movedItem.id, columnKey);
      } catch (e) {
        console.error(e);
        setCloudError("Move failed (Supabase).");
      }
    }
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

        <div className="flex gap-2 flex-wrap justify-center mb-3">
          {TAGS.map((tag) => (
            <span
              key={tag.name}
              className={`px-3 py-1 border rounded-none ${tag.color} text-[10px] font-black uppercase tracking-widest`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="text-[11px] font-black uppercase tracking-widest text-white/70">
          Mode:{" "}
          <span className="text-white">
            {userId ? "Supabase (Logged in)" : "LocalStorage (Logged out)"}
          </span>
          {loadingCloud && <span className="ml-2 text-cyan-300">Loading...</span>}
        </div>

        {cloudError && (
          <div className="mt-2 text-[11px] font-black uppercase tracking-widest text-red-400">
            {cloudError}
          </div>
        )}
      </header>

      {/* BOARD SECTION */}
      <main
        className="w-full max-w-7xl flex gap-4 px-8 pb-4 overflow-hidden justify-center"
        style={{ height: "calc(100vh - 210px)" }}
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
              className={`relative bg-[#0f172a] border-2 ${activeColMeta?.borderColor} w-full max-w-sm p-8 rounded-none`}
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
                className={`w-full py-3 text-sm font-black uppercase tracking-widest text-black rounded-none ${activeColMeta?.btnBg}`}
              >
                Create
              </button>

              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                {userId ? "Saved to Supabase" : "Saved to LocalStorage"}
              </p>
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
