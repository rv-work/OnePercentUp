import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react';

// Weekly Progress Chart Component
export const WeeklyProgressChart = ({ data }) => {
  const weeklyData = data?.categoryStats?.flatMap(category => 
    category.plans.flatMap(plan => 
      plan.months.flatMap(month => 
        month.weeks.map(week => {
          const weekProgress = week.days.reduce((total, day) => total + day.progress, 0) / week.days.length || 0;
          return {
            week: `W${week.weekNumber}`,
            progress: Math.round(weekProgress),
            completed: week.days.reduce((total, day) => total + day.tasks.filter(t => t.done).length, 0),
            total: week.days.reduce((total, day) => total + day.tasks.length, 0)
          };
        })
      )
    )
  ).slice(-8) || []; // Last 8 weeks

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Weekly Progress Trend</h3>
          <p className="text-gray-600 text-sm">Your progress over the last 8 weeks</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={weeklyData}>
          <defs>
            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="week" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="progress" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            fill="url(#colorProgress)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Category Distribution Pie Chart
export const CategoryDistributionChart = ({ data }) => {
  const categoryData = data?.categoryStats?.map((category, index) => ({
    name: category.category,
    value: category.totalPlans,
    progress: category.avgProgress,
    color: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 5]
  })) || [];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Goals by Category</h3>
          <p className="text-gray-600 text-sm">Distribution of your goals across categories</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <ResponsiveContainer width="60%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="w-35% space-y-3">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{category.name}</p>
                <p className="text-xs text-gray-600">{category.value} goals • {category.progress}% avg</p>
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
  const dailyData = data?.categoryStats?.flatMap(category => 
    category.plans.flatMap(plan => 
      plan.months.flatMap(month => 
        month.weeks.flatMap(week => 
          week.days.map(day => ({
            day: day.dayName.slice(0, 3),
            completed: day.tasks.filter(t => t.done).length,
            total: day.tasks.length,
            progress: day.progress
          }))
        )
      )
    )
  ).slice(-7) || []; // Last 7 days

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-green-200/50 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Daily Task Completion</h3>
          <p className="text-gray-600 text-sm">Tasks completed vs total tasks this week</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dailyData} barGap={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="total" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Performance Metrics Cards
export const PerformanceMetrics = ({ data }) => {
  const totalTasks = data?.categoryStats?.reduce((sum, cat) => 
    sum + cat.plans.reduce((planSum, plan) => 
      planSum + plan.months.reduce((monthSum, month) => 
        monthSum + month.weeks.reduce((weekSum, week) => 
          weekSum + week.days.reduce((daySum, day) => daySum + day.tasks.length, 0), 0), 0), 0), 0) || 0;

  const completedTasks = data?.categoryStats?.reduce((sum, cat) => 
    sum + cat.plans.reduce((planSum, plan) => 
      planSum + plan.months.reduce((monthSum, month) => 
        monthSum + month.weeks.reduce((weekSum, week) => 
          weekSum + week.days.reduce((daySum, day) => 
            daySum + day.tasks.filter(t => t.done).length, 0), 0), 0), 0), 0) || 0;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgDailyTasks = Math.round(totalTasks / 30); // Assuming 30 days average

  const metrics = [
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      bgColor: "purple-50"
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Target,
      color: "from-blue-500 to-teal-500",
      bgColor: "blue-50"
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: Activity,
      color: "from-green-500 to-emerald-500",
      bgColor: "green-50"
    },
    {
      title: "Daily Average",
      value: avgDailyTasks,
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      bgColor: "orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-lg`}>
              <metric.icon className="h-6 w-6 text-white" />
            </div>
            <div className={`px-3 py-1 bg-${metric.bgColor} rounded-full`}>
              <span className="text-xs font-medium text-gray-600">Analytics</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};