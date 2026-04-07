import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  Target,
  Zap,
  Activity,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const TodaysPlan = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchDailyTasks = async (date) => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(
        `https://onepercentup.onrender.com/api/user/daily-tasks?date=${formattedDate}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setDailyData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching daily tasks:", error);
      toast.error("Couldn't load today's mission.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyTasks(currentDate);
  }, [currentDate]);

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Optimistic update logic (reuse from Roadmap)
  const toggleTask = async (planIndex, dayId, taskNumber, currentStatus) => {
    const newStatus = !currentStatus;

    // Optimistic UI Update
    const newData = [...dailyData];
    const plan = newData[planIndex];
    const task = plan.tasks.find((t) => t.taskNumber === taskNumber);
    if (task) {
      task.done = newStatus;
      const completedCount = plan.tasks.filter((t) => t.done).length;
      plan.progress = Math.round((completedCount / plan.tasks.length) * 100);
      setDailyData(newData);
    }

    try {
      const res = await axios.put(
        `https://onepercentup.onrender.com/api/user/task/${dayId}/${taskNumber}`,
        { done: newStatus },
        { withCredentials: true },
      );
      if (!res.data.success) throw new Error("Update failed");
    } catch (error) {
      console.log("error : ", error);
      // Revert on failure
      const revertedData = [...dailyData];
      const revPlan = revertedData[planIndex];
      const revTask = revPlan.tasks.find((t) => t.taskNumber === taskNumber);
      if (revTask) {
        revTask.done = currentStatus;
        const compCount = revPlan.tasks.filter((t) => t.done).length;
        revPlan.progress = Math.round((compCount / revPlan.tasks.length) * 100);
        setDailyData(revertedData);
        toast.error("Failed to sync with server");
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = new Date().toDateString() === currentDate.toDateString();

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background Meshes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header & Date Navigator */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-3xl mb-6">
            <Zap className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Daily Command Center
          </h1>

          <div className="inline-flex items-center bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-6 flex flex-col items-center min-w-[200px]">
              <span
                className={`text-sm font-bold tracking-wider uppercase mb-1 ${isToday ? "text-emerald-400" : "text-purple-400"}`}
              >
                {isToday ? "Today" : "Time Travel Active"}
              </span>
              <span className="text-white font-medium">
                {formatDate(currentDate)}
              </span>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {!isToday && (
            <div className="mt-4">
              <button
                onClick={goToToday}
                className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
              >
                Return to Today
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : dailyData.length === 0 ? (
          <div className="text-center py-20 px-6 border-2 border-dashed border-white/10 rounded-[2rem] bg-[#0a0a0f]/50 backdrop-blur-sm">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Active Missions
            </h3>
            <p className="text-gray-500">
              Either your plans haven't started yet, or you've completed all
              timelines for this date.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {dailyData.map((plan, index) => {
              const isPlanDone = plan.progress === 100;

              return (
                <div
                  key={plan.planId}
                  className={`bg-[#0a0a0f]/80 backdrop-blur-xl border rounded-[2rem] p-6 md:p-8 transition-all duration-500 shadow-xl ${
                    isPlanDone
                      ? "border-emerald-500/30"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Plan Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-purple-400 uppercase tracking-wider">
                          {plan.category}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">
                          {plan.dayName}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {plan.planTitle}
                      </h2>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">
                          Execution
                        </div>
                        <div
                          className={`text-xl font-black ${isPlanDone ? "text-emerald-400" : "text-white"}`}
                        >
                          {plan.progress}%
                        </div>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="6"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke={isPlanDone ? "#10B981" : "#a855f7"}
                            strokeWidth="6"
                            strokeDasharray={175}
                            strokeDashoffset={175 - (175 * plan.progress) / 100}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3">
                    {plan.tasks.map((task) => (
                      <div
                        key={task.taskNumber}
                        onClick={() =>
                          toggleTask(
                            index,
                            plan.dayId,
                            task.taskNumber,
                            task.done,
                          )
                        }
                        className={`group cursor-pointer p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                          task.done
                            ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all ${
                            task.done
                              ? "bg-emerald-500 border-emerald-500 text-white scale-110"
                              : "border-gray-500 text-transparent group-hover:border-purple-400 group-hover:text-purple-400"
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 ${task.done ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                          />
                        </div>

                        <p
                          className={`text-base md:text-lg transition-all duration-300 ${
                            task.done
                              ? "text-gray-500 line-through"
                              : "text-gray-200 group-hover:text-white"
                          }`}
                        >
                          {task.task}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysPlan;
