import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Calendar, Target, Activity } from "lucide-react";

// Custom Tooltip Style for Dark Mode
const customTooltipStyle = {
  backgroundColor: "rgba(10, 10, 15, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
  color: "#fff",
};

// Weekly Progress Chart Component
export const WeeklyProgressChart = ({ data }) => {
  const weeklyData =
    data?.categoryStats
      ?.flatMap((category) =>
        category.plans.flatMap((plan) =>
          plan.months.flatMap((month) =>
            month.weeks.map((week) => {
              const weekProgress =
                week.days.reduce((total, day) => total + day.progress, 0) /
                  week.days.length || 0;
              return {
                week: `W${week.weekNumber}`,
                progress: Math.round(weekProgress),
                completed: week.days.reduce(
                  (total, day) =>
                    total + day.tasks.filter((t) => t.done).length,
                  0,
                ),
                total: week.days.reduce(
                  (total, day) => total + day.tasks.length,
                  0,
                ),
              };
            }),
          ),
        ),
      )
      .slice(-8) || []; // Last 8 weeks

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl">
          <TrendingUp className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Velocity Trend</h3>
          <p className="text-gray-400 text-sm">
            Execution consistency over 8 weeks
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={weeklyData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={customTooltipStyle}
              itemStyle={{ color: "#e9d5ff" }}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#colorProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Category Distribution Pie Chart
export const CategoryDistributionChart = ({ data }) => {
  const categoryData =
    data?.categoryStats?.map((category, index) => ({
      name: category.category,
      value: category.totalPlans,
      progress: category.avgProgress,
      color: ["#a855f7", "#3b82f6", "#10b981", "#f43f5e", "#f59e0b"][index % 5], // Neon palette
    })) || [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-teal-500/20 border border-blue-500/30 rounded-2xl">
          <Target className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Domain Allocation</h3>
          <p className="text-gray-400 text-sm">
            Distribution of your active targets
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-1">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={customTooltipStyle}
              itemStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="w-[45%] space-y-4">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full shadow-lg"
                style={{
                  backgroundColor: category.color,
                  boxShadow: `0 0 10px ${category.color}`,
                }}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white truncate">
                  {category.name}
                </p>
                <p className="text-xs text-gray-500">
                  {category.value} goals • {category.progress}% done
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Daily Task Completion Chart
export const DailyTaskChart = ({ data }) => {
  const dailyData =
    data?.categoryStats
      ?.flatMap((category) =>
        category.plans.flatMap((plan) =>
          plan.months.flatMap((month) =>
            month.weeks.flatMap((week) =>
              week.days.map((day) => ({
                day: day.dayName.slice(0, 3),
                completed: day.tasks.filter((t) => t.done).length,
                total: day.tasks.length,
                progress: day.progress,
              })),
            ),
          ),
        ),
      )
      .slice(-7) || []; // Last 7 days

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl">
          <Activity className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Daily Output</h3>
          <p className="text-gray-400 text-sm">
            Micro-tasks completed over the last 7 days
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyData}
            barGap={0}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={customTooltipStyle}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            {/* Background Bar (Total) */}
            <Bar
              dataKey="total"
              fill="rgba(255,255,255,0.1)"
              radius={[6, 6, 0, 0]}
              barSize={30}
            />
            {/* Foreground Bar (Completed) */}
            <Bar
              dataKey="completed"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Performance Metrics Cards
export const PerformanceMetrics = ({ data }) => {
  const totalTasks =
    data?.categoryStats?.reduce(
      (sum, cat) =>
        sum +
        cat.plans.reduce(
          (planSum, plan) =>
            planSum +
            plan.months.reduce(
              (monthSum, month) =>
                monthSum +
                month.weeks.reduce(
                  (weekSum, week) =>
                    weekSum +
                    week.days.reduce(
                      (daySum, day) => daySum + day.tasks.length,
                      0,
                    ),
                  0,
                ),
              0,
            ),
          0,
        ),
      0,
    ) || 0;

  const completedTasks =
    data?.categoryStats?.reduce(
      (sum, cat) =>
        sum +
        cat.plans.reduce(
          (planSum, plan) =>
            planSum +
            plan.months.reduce(
              (monthSum, month) =>
                monthSum +
                month.weeks.reduce(
                  (weekSum, week) =>
                    weekSum +
                    week.days.reduce(
                      (daySum, day) =>
                        daySum + day.tasks.filter((t) => t.done).length,
                      0,
                    ),
                  0,
                ),
              0,
            ),
          0,
        ),
      0,
    ) || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgDailyTasks = Math.round(totalTasks / 30) || 1; // Assuming 30 days avg, fallback to 1

  const metrics = [
    {
      title: "Hit Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Total Micro-tasks",
      value: totalTasks,
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Tasks Crushed",
      value: completedTasks,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Daily Burn Rate",
      value: avgDailyTasks,
      icon: Calendar,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl border ${metric.bg}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="text-xs font-medium text-gray-400">Metric</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-white mb-1">
              {metric.value}
            </p>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              {metric.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
