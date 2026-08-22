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

const columns = [
  {
    key: "todo",
    title: "To Do",
    icon: Layout,
  },
  {
    key: "progress",
    title: "In Progress",
    icon: Calendar,
  },
  {
    key: "done",
    title: "Done",
    icon: CheckCircle2,
  },
];

const TAGS = [{ name: "Organize" }, { name: "Plan" }, { name: "Note" }];

const LS_KEY = "notrainer-kanban-tasks";

function emptyBoard() {
  return { todo: [], progress: [], done: [] };
}

function groupByStatus(rows) {
  const board = emptyBoard();

  for (const r of rows) {
    if (board[r.status]) {
      board[r.status].push({
        id: r.id,
        title: r.title,
      });
    }
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

        if (saved) {
          setData(JSON.parse(saved));
        } else {
          setData(emptyBoard());
        }

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
    if (!userId) {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    }
  }, [data, userId]);

  const activeColMeta = useMemo(
    () => columns.find((c) => c.key === activeColumn),
    [activeColumn],
  );

  // SUPABASE HELPERS
  const insertSupabaseTask = async ({ title, status }) => {
    const { data: rows, error } = await supabase
      .from("kanban_tasks")
      .insert([
        {
          user_id: userId,
          title,
          status,
        },
      ])
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

    const optimistic = {
      id: crypto.randomUUID(),
      title,
    };

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
                ? {
                    id: created.id,
                    title: created.title,
                  }
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
    setDragging({
      item,
      column: colKey,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // --- Mobile Handlers (Long Press) ---

  const handleTouchStart = (e, item, colKey) => {
    longPressTimer.current = setTimeout(() => {
      setDragging({
        item,
        column: colKey,
      });

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

    setTouchPos({
      x: touch.clientX,
      y: touch.clientY,
    });

    if (mainRef.current) {
      const rect = mainRef.current.getBoundingClientRect();

      const scrollThreshold = 60;
      const scrollSpeed = 10;

      if (touch.clientY < rect.top + scrollThreshold) {
        mainRef.current.scrollTop -= scrollSpeed;
      } else if (
        touch.clientY >
        rect.bottom - scrollThreshold
      ) {
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

    const dropTarget = document.elementFromPoint(
      touchPos.x,
      touchPos.y,
    );

    const columnElement = dropTarget?.closest(
      "[data-column-key]",
    );

    if (columnElement) {
      const targetKey = columnElement.getAttribute(
        "data-column-key",
      );

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
          width: 6px;
        }

        .kanban-scroll::-webkit-scrollbar-thumb {
          background: color(display-p3 0.079 0.201 0.346);
          border-radius: 0px;
        }

        .kanban-scroll::-webkit-scrollbar-track {
          background: color(display-p3 0.056 0.958 0.949);
        }
      `}</style>

      <div
        className="relative flex w-full flex-col items-center overflow-hidden font-sans h-[calc(100dvh-40px)] md:h-[calc(100dvh-48px)]"
        style={{
          backgroundColor: "color(display-p3 0.056 0.958 0.949)",
          color: "color(display-p3 0.079 0.201 0.346)",
        }}
      >
        {/* Header */}

        <header className="relative z-10 w-full max-w-6xl px-6 pt-8 pb-4 text-center md:pt-10 md:pb-6 shrink-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black uppercase tracking-tight md:text-6xl"
            style={{
              fontFamily: "'Krona One', sans-serif",
              color: "color(display-p3 0.079 0.201 0.346)",
            }}
          >
            Kanban Board
            
          </motion.h1>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag.name}
                className="px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] border-2"
                style={{
                  backgroundColor: "color(display-p3 0.079 0.201 0.346)",
                  color: "color(display-p3 0.056 0.958 0.949)",
                  borderColor: "color(display-p3 0.079 0.201 0.346)",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div
            className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              color: "color(display-p3 0.079 0.201 0.346)",
            }}
          >
            <div
              className="h-2 w-2"
              style={{
                backgroundColor: "color(display-p3 0.98 0.78 0.12)",
              }}
            />

            Mode:{" "}

            <span
              className="font-black"
              style={{
                color: "color(display-p3 0.079 0.201 0.346)",
              }}
            >
              {userId ? "Cloud Sync" : "Local Storage"}
            </span>

            {loadingCloud && (
              <span className="ml-2 inline-flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 animate-pulse"
                  style={{
                    backgroundColor: "color(display-p3 0.079 0.201 0.346)",
                  }}
                />
                <span
                  className="w-1.5 h-1.5 animate-pulse"
                  style={{
                    backgroundColor: "color(display-p3 0.079 0.201 0.346)",
                    animationDelay: "0.2s",
                  }}
                />
                <span
                  className="w-1.5 h-1.5 animate-pulse"
                  style={{
                    backgroundColor: "color(display-p3 0.079 0.201 0.346)",
                    animationDelay: "0.4s",
                  }}
                />
              </span>
            )}
          </div>

          {/* Instruction Hint for Mobile */}

          <div
            className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] md:hidden"
            style={{
              color: "color(display-p3 0.079 0.201 0.346)",
            }}
          >
            Hold card to drag
          </div>

          {cloudError && (
            <div
              className="mt-3 inline-block px-4 py-1.5 text-xs font-black uppercase tracking-widest border-2"
              style={{
                backgroundColor: "color(display-p3 0.98 0.78 0.12)",
                color: "color(display-p3 0.079 0.201 0.346)",
                borderColor: "color(display-p3 0.079 0.201 0.346)",
              }}
            >
              {cloudError}
            </div>
          )}
        </header>

        {/* Main Grid Container */}

        <main
          ref={mainRef}
          className="relative z-10 grid w-full max-w-6xl flex-1 min-h-0 grid-rows-3 gap-4 overflow-auto px-4 pb-6 md:grid-cols-3 md:grid-rows-1 md:gap-6 md:px-6 no-scrollbar"
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {columns.map((col, index) => (
            <motion.div
              key={col.key}
              data-column-key={col.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
              }}
              onDragOver={handleDragOver}
              onDrop={() => onDrop(col.key)}
              className="flex flex-col overflow-hidden transition-all"
              style={{
                backgroundColor: "color(display-p3 0.056 0.958 0.949)",
                border: "4px solid color(display-p3 0.079 0.201 0.346)",
              }}
            >
              {/* Column Header */}

              <div
                className="flex items-center justify-between px-4 py-3 shrink-0 border-b-4"
                style={{
                  backgroundColor: "color(display-p3 0.079 0.201 0.346)",
                  borderBottomColor: "color(display-p3 0.079 0.201 0.346)",
                }}
              >
                <div className="flex items-center gap-3">
                  <col.icon
                    size={18}
                    style={{
                      color: "color(display-p3 0.056 0.958 0.949)",
                    }}
                  />

                  <h2
                    className="text-sm font-black uppercase tracking-tight"
                    style={{
                      color: "color(display-p3 0.056 0.958 0.949)",
                    }}
                  >
                    {col.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 text-xs font-black border"
                    style={{
                      backgroundColor: "color(display-p3 0.056 0.958 0.949)",
                      color: "color(display-p3 0.079 0.201 0.346)",
                      borderColor: "color(display-p3 0.056 0.958 0.949)",
                    }}
                  >
                    {data[col.key].length}
                  </span>

                  <button
                    onClick={() => {
                      setActiveColumn(col.key);
                      setModalOpen(true);
                    }}
                    className="flex h-7 w-7 items-center justify-center border-2 transition-all active:scale-95"
                    style={{
                      backgroundColor: "color(display-p3 0.98 0.78 0.12)",
                      color: "color(display-p3 0.079 0.201 0.346)",
                      borderColor: "color(display-p3 0.056 0.958 0.949)",
                    }}
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Cards Container */}

              <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-3 kanban-scroll">
                <AnimatePresence mode="popLayout">
                  {data[col.key].length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full items-center justify-center"
                    >
                      <div
                        className="text-center px-4 py-8 border-2 border-dashed"
                        style={{
                          borderColor: "color(display-p3 0.079 0.201 0.346)",
                        }}
                      >
                        <p
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{
                            color: "color(display-p3 0.079 0.201 0.346)",
                          }}
                        >
                          Drop tasks here
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {data[col.key].map((item) => {
                    const isThisDragging =
                      dragging?.item.id === item.id && isDragReady;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{
                          opacity: 0,
                          scale: 0.95,
                          y: 10,
                        }}
                        animate={{
                          opacity: isThisDragging ? 0.3 : 1,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                          y: -10,
                        }}
                        whileHover={{
                          scale: 1.02,
                          y: -2,
                        }}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, item, col.key)
                        }
                        onTouchStart={(e) =>
                          handleTouchStart(e, item, col.key)
                        }
                        className="group relative cursor-grab active:cursor-grabbing transition-shadow"
                        style={{
                          backgroundColor: "color(display-p3 0.079 0.201 0.346)",
                          border:
                            "2px solid color(display-p3 0.079 0.201 0.346)",
                          padding: "14px 16px",
                          boxShadow: "none",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <GripVertical
                              size={16}
                              className="mt-0.5 shrink-0 transition-colors"
                              style={{
                                color: "color(display-p3 0.056 0.958 0.949)",
                              }}
                            />

                            <p
                              className="text-sm font-bold leading-snug tracking-tight break-words"
                              style={{
                                color: "color(display-p3 0.056 0.958 0.949)",
                              }}
                            >
                              {item.title}
                            </p>
                          </div>

                          {/* DELETE BUTTON */}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(col.key, item.id);
                            }}
                            className="shrink-0 flex h-6 w-6 items-center justify-center border transition-all md:opacity-0 md:group-hover:opacity-100"
                            style={{
                              color: "color(display-p3 0.056 0.958 0.949)",
                              borderColor: "color(display-p3 0.056 0.958 0.949)",
                            }}
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
            className="fixed z-[100] pointer-events-none w-[220px] p-4 font-bold uppercase text-sm"
            style={{
              left: touchPos.x - 110,
              top: touchPos.y - 30,
              transform: "rotate(2deg) scale(1.05)",
              backgroundColor: "color(display-p3 0.98 0.78 0.12)",
              border:
                "2px solid color(display-p3 0.079 0.201 0.346)",
              color: "color(display-p3 0.079 0.201 0.346)",
              boxShadow: "none",
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
              className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
              style={{
                backgroundColor:
                  "color(display-p3 0.079 0.201 0.346 / 0.8)",
              }}
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm overflow-hidden"
                style={{
                  backgroundColor: "color(display-p3 0.056 0.958 0.949)",
                  border:
                    "4px solid color(display-p3 0.079 0.201 0.346)",
                  padding: "32px",
                }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center border-2"
                      style={{
                        backgroundColor: "color(display-p3 0.079 0.201 0.346)",
                        borderColor: "color(display-p3 0.079 0.201 0.346)",
                        color: "color(display-p3 0.056 0.958 0.949)",
                      }}
                    >
                      {activeColMeta && (
                        <activeColMeta.icon size={20} />
                      )}
                    </div>

                    <h3
                      className="text-xl font-black uppercase tracking-tight"
                      style={{
                        color: "color(display-p3 0.079 0.201 0.346)",
                      }}
                    >
                      New Task
                    </h3>
                  </div>

                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center border transition-colors"
                    style={{
                      backgroundColor: "color(display-p3 0.056 0.958 0.949)",
                      color: "color(display-p3 0.079 0.201 0.346)",
                      borderColor: "color(display-p3 0.079 0.201 0.346)",
                    }}
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <input
                  autoFocus
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="Task title..."
                  className="w-full border-b-2 py-3 px-2 text-base font-bold focus:outline-none transition-colors"
                  style={{
                    backgroundColor: "color(display-p3 0.056 0.958 0.949)",
                    borderColor: "color(display-p3 0.079 0.201 0.346)",
                    color: "color(display-p3 0.079 0.201 0.346)",
                  }}
                />

                <button
                  onClick={addTask}
                  className="mt-6 w-full py-3.5 text-sm font-black uppercase tracking-[0.2em] border-2 transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: "color(display-p3 0.98 0.78 0.12)",
                    color: "color(display-p3 0.079 0.201 0.346)",
                    borderColor: "color(display-p3 0.079 0.201 0.346)",
                  }}
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