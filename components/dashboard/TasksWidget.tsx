"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleTask } from "@/lib/actions";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  priority: string;
  due: string;
  completed: boolean;
}

const priorityStyles: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export default function TasksWidget({ tasks }: { tasks: Task[] }) {
  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await toggleTask(id, !completed);
      toast.success(completed ? "Task marked as incomplete" : "Task completed!");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">My Tasks</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Things to get done</p>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all",
              task.completed
                ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
            )}
          >
            <button
              onClick={() => handleToggle(task.id, task.completed)}
              className="shrink-0 mt-0.5"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-indigo-500 transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  task.completed ? "text-slate-500 dark:text-slate-400 line-through" : "text-slate-900 dark:text-white"
                )}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium border",
                    priorityStyles[task.priority]
                  )}
                >
                  {task.priority}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  {task.due}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
