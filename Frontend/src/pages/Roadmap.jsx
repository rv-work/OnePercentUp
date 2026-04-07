import React, { useState, useEffect } from "react";
import {
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight,
  Star,
  BarChart3,
  Activity,
  Calendar as CalendarIcon,
  Check,
  ArrowRight,
  Zap,
  ListTodo,
} from "lucide-react";
import {
  CategoryDistributionChart,
  DailyTaskChart,
  PerformanceMetrics,
  WeeklyProgressChart,
} from "../components/Charts";

const Roadmap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/roadmap", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateTaskStatus = async (dayId, taskNumber, done) => {
    // OPTIMISTIC UPDATE
    const updateDataOptimistically = (data) => {
      if (!data) return data;
      const newData = JSON.parse(JSON.stringify(data));
      newData.categoryStats?.forEach((category) => {
        category.plans?.forEach((plan) => {
          plan.months?.forEach((month) => {
            month.weeks?.forEach((week) => {
              week.days?.forEach((day) => {
                if (day._id === dayId) {
                  const task = day.tasks.find(
                    (t) => t.taskNumber === taskNumber,
                  );
                  if (task) {
                    task.done = done;
                    const completedTasks = day.tasks.filter(
                      (t) => t.done,
                    ).length;
                    day.progress = Math.round(
                      (completedTasks / day.tasks.length) * 100,
                    );
                  }
                }
              });
            });
          });
        });
      });
      return newData;
    };

    setData((prevData) => updateDataOptimistically(prevData));

    if (selectedDay && selectedDay._id === dayId) {
      setSelectedDay((prevDay) => {
        const updatedDay = { ...prevDay };
        const taskIndex = updatedDay.tasks.findIndex(
          (t) => t.taskNumber === taskNumber,
        );
        if (taskIndex !== -1) {
          updatedDay.tasks[taskIndex] = {
            ...updatedDay.tasks[taskIndex],
            done,
          };
          const completedTasks = updatedDay.tasks.filter((t) => t.done).length;
          updatedDay.progress = Math.round(
            (completedTasks / updatedDay.tasks.length) * 100,
          );
        }
        return updatedDay;
      });
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/task/${dayId}/${taskNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ done }),
        },
      );

      if (!response.ok) {
        console.error("API call failed, reverting optimistic update");
        setData((prevData) => updateDataOptimistically(prevData, !done));

        if (selectedDay && selectedDay._id === dayId) {
          setSelectedDay((prevDay) => {
            const revertedDay = { ...prevDay };
            const taskIndex = revertedDay.tasks.findIndex(
              (t) => t.taskNumber === taskNumber,
            );
            if (taskIndex !== -1) {
              revertedDay.tasks[taskIndex] = {
                ...revertedDay.tasks[taskIndex],
                done: !done,
              };
              const completedTasks = revertedDay.tasks.filter(
                (t) => t.done,
              ).length;
              revertedDay.progress = Math.round(
                (completedTasks / revertedDay.tasks.length) * 100,
              );
            }
            return revertedDay;
          });
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setData((prevData) => updateDataOptimistically(prevData, !done));

      if (selectedDay && selectedDay._id === dayId) {
        setSelectedDay((prevDay) => {
          const revertedDay = { ...prevDay };
          const taskIndex = revertedDay.tasks.findIndex(
            (t) => t.taskNumber === taskNumber,
          );
          if (taskIndex !== -1) {
            revertedDay.tasks[taskIndex] = {
              ...revertedDay.tasks[taskIndex],
              done: !done,
            };
            const completedTasks = revertedDay.tasks.filter(
              (t) => t.done,
            ).length;
            revertedDay.progress = Math.round(
              (completedTasks / revertedDay.tasks.length) * 100,
            );
          }
          return revertedDay;
        });
      }
    }
  };

  // Base Layout Wrapper with Backgrounds
  const BaseLayout = ({ children, backAction, backText }) => (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative pb-20 pt-30">
      {/* Deep Space Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {backAction && (
          <button
            onClick={backAction}
            className="group flex items-center space-x-2 text-gray-400 hover:text-white mb-8 font-semibold transition-all duration-300 w-fit"
          >
            <div className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:bg-white/10 transition-colors">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </div>
            <span>{backText}</span>
          </button>
        )}
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin"></div>
          <Zap className="absolute text-purple-500 w-6 h-6 animate-pulse" />
        </div>
      </div>
    );
  }

  // 1. DASHBOARD OVERVIEW (Categories)
  if (!selectedCategory) {
    return (
      <BaseLayout>
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-4">
            <Activity className="w-3 h-3" /> Command Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-indigo-400 bg-clip-text text-transparent mb-4 tracking-tight">
            Roadmap Overview
          </h1>
          <p className="text-gray-400 text-lg">
            Track your execution across all primary domains.
          </p>
        </div>

        {/* Top Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl group hover:border-purple-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Total Goals
                </p>
                <p className="text-4xl font-bold text-white">
                  {data?.totalGoals || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl group hover:border-blue-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Categories
                </p>
                <p className="text-4xl font-bold text-white">
                  {data?.categoryStats?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Completed
                </p>
                <p className="text-4xl font-bold text-white">
                  {data?.categoryStats?.reduce(
                    (sum, cat) => sum + cat.completedPlans,
                    0,
                  ) || 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl group hover:border-pink-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Avg Progress
                </p>
                <p className="text-4xl font-bold text-white">
                  {Math.round(
                    data?.categoryStats?.reduce(
                      (sum, cat) => sum + cat.avgProgress,
                      0,
                    ) / (data?.categoryStats?.length || 1) || 0,
                  )}
                  %
                </p>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-pink-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section (Assuming Chart components are styled for dark mode or transparent) */}
        <div className="mb-12 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Execution Analytics
          </h2>
          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6">
            <PerformanceMetrics data={data} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6">
              <WeeklyProgressChart data={data} />
            </div>
            <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6">
              <CategoryDistributionChart data={data} />
            </div>
          </div>
          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6">
            <DailyTaskChart data={data} />
          </div>
        </div>

        {/* Categories Grid */}
        <h2 className="text-2xl font-bold text-white mb-6">Active Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.categoryStats?.map((category, index) => {
            const colors = [
              "text-purple-400 bg-purple-500/20 group-hover:bg-purple-500/30",
              "text-blue-400 bg-blue-500/20 group-hover:bg-blue-500/30",
              "text-emerald-400 bg-emerald-500/20 group-hover:bg-emerald-500/30",
            ];
            const barColors = [
              "from-purple-500 to-pink-500",
              "from-blue-500 to-teal-500",
              "from-emerald-500 to-green-500",
            ];
            const colorIdx = index % 3;

            return (
              <div
                key={category.category}
                onClick={() => setSelectedCategory(category)}
                className="group cursor-pointer bg-[#0a0a0f]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-2xl transition-colors ${colors[colorIdx]}`}
                    >
                      <Star className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {category.category}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>

                <div className="space-y-4 relative z-10 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Total Goals</span>
                    <span className="font-bold text-white">
                      {category.totalPlans}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Completed</span>
                    <span className="font-bold text-emerald-400">
                      {category.completedPlans}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Efficiency</span>
                    <span className="font-bold text-blue-400">
                      {category.avgProgress}%
                    </span>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${barColors[colorIdx]} transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                      style={{ width: `${category.avgProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BaseLayout>
    );
  }

  // 2. CATEGORY PLANS VIEW
  if (selectedCategory && !selectedPlan) {
    return (
      <BaseLayout
        backAction={() => setSelectedCategory(null)}
        backText="Back to Domains"
      >
        <div className="mb-12 flex items-center space-x-6">
          <div className="p-5 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-3xl">
            <Star className="h-10 w-10 text-purple-400" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {selectedCategory.category}
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              {selectedCategory.totalPlans} active missions in this domain
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedCategory.plans.map((plan) => (
            <div
              key={plan._id}
              onClick={() => setSelectedPlan(plan)}
              className="group cursor-pointer bg-[#0a0a0f]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:border-purple-500/50 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  {plan.title}
                </h3>
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400" />
                </div>
              </div>

              <p className="text-gray-400 mb-8 line-clamp-2 min-h-[3rem]">
                {plan.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Duration
                  </p>
                  <p className="text-xl font-bold text-white">
                    {plan.stats.totalMonths} Months
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="text-xl font-bold text-emerald-400">
                    {plan.stats.overallProgress}% Done
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-400">
                    Master Progress
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    {plan.priority} Priority
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mb-3">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    style={{ width: `${plan.stats.overallProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {plan.stats.completedTasks} of {plan.stats.totalTasks}{" "}
                  micro-tasks completed
                </p>
              </div>
            </div>
          ))}
        </div>
      </BaseLayout>
    );
  }

  // 3. PLAN MONTHS VIEW
  if (selectedPlan && !selectedMonth) {
    return (
      <BaseLayout
        backAction={() => setSelectedPlan(null)}
        backText="Back to Missions"
      >
        <div className="mb-12 flex items-center space-x-6">
          <div className="p-5 bg-gradient-to-br from-blue-500/20 to-teal-500/20 border border-blue-500/30 rounded-3xl">
            <Calendar className="h-10 w-10 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {selectedPlan.title}
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              {selectedPlan.months.length} phases (months) mapped out
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedPlan.months.map((month) => {
            const monthProgress =
              month.weeks.reduce((total, week) => {
                const weekProgress =
                  week.days.reduce(
                    (dayTotal, day) => dayTotal + day.progress,
                    0,
                  ) / (week.days.length || 1);
                return total + weekProgress;
              }, 0) / (month.weeks.length || 1) || 0;

            return (
              <div
                key={month._id}
                onClick={() => setSelectedMonth(month)}
                className="group cursor-pointer bg-[#0a0a0f]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:border-blue-500/50 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {month.month}
                  </h3>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                  </div>
                </div>

                <p className="text-gray-400 mb-8 line-clamp-2 min-h-[3rem] text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-white font-medium block mb-1">
                    Monthly Target:
                  </span>
                  {month.target}
                </p>

                <div className="flex gap-4 mb-8">
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-2xl font-bold text-white mb-1">
                      {month.weeks.length}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Weeks
                    </p>
                  </div>
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-2xl font-bold text-emerald-400 mb-1">
                      {Math.round(monthProgress)}%
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Progress
                    </p>
                  </div>
                </div>

                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                    style={{ width: `${monthProgress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </BaseLayout>
    );
  }

  // 4. MONTH WEEKS VIEW
  if (selectedMonth && !selectedWeek) {
    return (
      <BaseLayout
        backAction={() => setSelectedMonth(null)}
        backText="Back to Phases"
      >
        <div className="mb-12 flex items-center space-x-6">
          <div className="p-5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl">
            <CalendarIcon className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {selectedMonth.month}
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Detailed breakdown into {selectedMonth.weeks.length} sprint weeks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedMonth.weeks.map((week) => {
            const weekProgress =
              week.days.reduce((total, day) => total + day.progress, 0) /
                (week.days.length || 1) || 0;

            return (
              <div
                key={week._id}
                onClick={() => setSelectedWeek(week)}
                className="group cursor-pointer bg-[#0a0a0f]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:border-emerald-500/50 transition-all duration-500 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Sprint {week.weekNumber}
                  </h3>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors">
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-400" />
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                    <p className="text-xl font-bold text-white">
                      {week.days.length}
                    </p>
                    <p className="text-xs text-gray-500 uppercase mt-1">Days</p>
                  </div>
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                    <p className="text-xl font-bold text-emerald-400">
                      {Math.round(weekProgress)}%
                    </p>
                    <p className="text-xs text-gray-500 uppercase mt-1">Done</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                      style={{ width: `${weekProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-auto bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Target className="w-3 h-3" /> Focus
                  </p>
                  <ul className="text-sm text-gray-300 space-y-1.5">
                    {week.goals.slice(0, 2).map((goal, i) => (
                      <li key={i} className="truncate">
                        • {goal}
                      </li>
                    ))}
                    {week.goals.length > 2 && (
                      <li className="text-gray-500 text-xs mt-2 italic">
                        +{week.goals.length - 2} more targets
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </BaseLayout>
    );
  }

  // 5. WEEK DAYS & TASKS VIEW
  if (selectedWeek && !selectedDay) {
    return (
      <BaseLayout
        backAction={() => setSelectedWeek(null)}
        backText="Back to Sprints"
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="p-5 bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-3xl">
              <Clock className="h-10 w-10 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Sprint {selectedWeek.weekNumber}
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Execution block for this week
              </p>
            </div>
          </div>

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 max-w-sm w-full">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" /> Core Objectives
            </h3>
            <div className="flex flex-col gap-2">
              {selectedWeek.goals.map((goal, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5"
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedWeek.days.map((day) => {
            const isFullyDone = day.progress === 100;
            return (
              <div
                key={day._id}
                onClick={() => setSelectedDay(day)}
                className={`group cursor-pointer bg-[#0a0a0f]/80 backdrop-blur-xl p-6 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 ${
                  isFullyDone
                    ? "border-emerald-500/30 hover:border-emerald-500/60"
                    : "border-white/10 hover:border-orange-500/50"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-xl font-bold transition-colors ${isFullyDone ? "text-emerald-400" : "text-white group-hover:text-orange-400"}`}
                  >
                    {day.dayName}
                  </h3>
                  <div
                    className={`p-2 rounded-xl border transition-colors ${
                      isFullyDone
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-white/5 border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/30"
                    }`}
                  >
                    {isFullyDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-400" />
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                    <p className="text-xl font-bold text-white">
                      {day.tasks.length}
                    </p>
                    <p className="text-xs text-gray-500 uppercase mt-1">
                      Tasks
                    </p>
                  </div>
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                    <p
                      className={`text-xl font-bold ${isFullyDone ? "text-emerald-400" : "text-orange-400"}`}
                    >
                      {day.progress}%
                    </p>
                    <p className="text-xs text-gray-500 uppercase mt-1">Done</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-1000 ${
                        isFullyDone
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                          : "bg-gradient-to-r from-orange-500 to-pink-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                      }`}
                      style={{ width: `${day.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  {day.tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <div className="mt-0.5 flex-shrink-0">
                        {task.done ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <div className="h-3 w-3 border border-gray-500 rounded-full mt-0.5"></div>
                        )}
                      </div>
                      <span
                        className={`truncate ${task.done ? "text-gray-500 line-through" : "text-gray-300"}`}
                      >
                        {task.task}
                      </span>
                    </div>
                  ))}
                  {day.tasks.length > 3 && (
                    <p className="text-center text-xs text-gray-600 italic mt-3 pt-2 border-t border-white/5">
                      +{day.tasks.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </BaseLayout>
    );
  }

  // 6. SINGLE DAY TASK VIEW
  if (selectedDay) {
    const isFullyDone = selectedDay.progress === 100;

    return (
      <BaseLayout
        backAction={() => setSelectedDay(null)}
        backText="Back to Days"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <div
              className={`inline-flex items-center justify-center p-6 rounded-full mb-6 border ${
                isFullyDone
                  ? "bg-emerald-500/20 border-emerald-500/30"
                  : "bg-pink-500/20 border-pink-500/30"
              }`}
            >
              <ListTodo
                className={`h-12 w-12 ${isFullyDone ? "text-emerald-400" : "text-pink-400"}`}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              {selectedDay.dayName} Action Plan
            </h1>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300">
                {selectedDay.tasks.length} Total Targets
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                {selectedDay.tasks.filter((t) => t.done).length} Completed
              </div>
              <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400">
                {selectedDay.tasks.filter((t) => !t.done).length} Pending
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Daily Progress</h3>
              <span
                className={`text-2xl font-black ${isFullyDone ? "text-emerald-400" : "text-pink-400"}`}
              >
                {selectedDay.progress}%
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  isFullyDone
                    ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                }`}
                style={{ width: `${selectedDay.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedDay.tasks.map((task) => (
              <div
                key={task.taskNumber}
                onClick={() =>
                  updateTaskStatus(selectedDay._id, task.taskNumber, !task.done)
                }
                className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex items-center gap-5 ${
                  task.done
                    ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                    : "bg-[#0a0a0f]/80 border-white/10 hover:border-white/30 hover:bg-white/5"
                }`}
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    task.done
                      ? "bg-emerald-500 border-emerald-500 text-white scale-110"
                      : "border-gray-500 text-transparent group-hover:border-pink-500 group-hover:text-pink-500"
                  }`}
                >
                  <Check
                    className={`w-5 h-5 ${task.done ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  />
                </div>

                <div className="flex-1">
                  <p
                    className={`text-lg transition-all duration-300 ${
                      task.done
                        ? "text-gray-500 line-through"
                        : "text-white font-medium"
                    }`}
                  >
                    {task.task}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BaseLayout>
    );
  }

  return null;
};

export default Roadmap;
