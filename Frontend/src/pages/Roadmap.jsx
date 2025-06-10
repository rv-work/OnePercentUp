
import React, { useState, useEffect } from 'react';
import { 
  Target, Calendar, CheckCircle2, Clock, TrendingUp, 
  ChevronRight, ChevronDown, Star, BarChart3, Activity,
  Calendar as CalendarIcon, Check, X, ArrowRight
} from 'lucide-react';
import { CategoryDistributionChart, DailyTaskChart, PerformanceMetrics, WeeklyProgressChart } from '../components/Charts';

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
        const response = await fetch('http://localhost:5000/api/user/roadmap', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include"
        });

        const result = await response.json();
        console.log("data:", result);
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateTaskStatus = async (dayId, taskNumber, done) => {
    // OPTIMISTIC UPDATE - Turant UI update karo
    const updateDataOptimistically = (data) => {
      if (!data) return data;

      const newData = JSON.parse(JSON.stringify(data)); // Deep clone

      // Find and update the specific task in nested structure
      newData.categoryStats?.forEach(category => {
        category.plans?.forEach(plan => {
          plan.months?.forEach(month => {
            month.weeks?.forEach(week => {
              week.days?.forEach(day => {
                if (day._id === dayId) {
                  const task = day.tasks.find(t => t.taskNumber === taskNumber);
                  if (task) {
                    task.done = done;
                    
                    // Recalculate day progress
                    const completedTasks = day.tasks.filter(t => t.done).length;
                    day.progress = Math.round((completedTasks / day.tasks.length) * 100);
                  }
                }
              });
            });
          });
        });
      });

      return newData;
    };

    // Update UI immediately
    setData(prevData => updateDataOptimistically(prevData));

    // Update selected day if it's the current one
    if (selectedDay && selectedDay._id === dayId) {
      setSelectedDay(prevDay => {
        const updatedDay = { ...prevDay };
        const taskIndex = updatedDay.tasks.findIndex(t => t.taskNumber === taskNumber);
        if (taskIndex !== -1) {
          updatedDay.tasks[taskIndex] = { ...updatedDay.tasks[taskIndex], done };
          // Recalculate progress
          const completedTasks = updatedDay.tasks.filter(t => t.done).length;
          updatedDay.progress = Math.round((completedTasks / updatedDay.tasks.length) * 100);
        }
        return updatedDay;
      });
    }

    // Background API call
    try {
      const response = await fetch(`http://localhost:5000/api/user/task/${dayId}/${taskNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ done })
      });

      if (!response.ok) {
        // Agar API fail ho jaye to revert kar do
        console.error('API call failed, reverting optimistic update');
        
        // Revert optimistic update
        setData(prevData => updateDataOptimistically(prevData, !done)); // Opposite value
        
        if (selectedDay && selectedDay._id === dayId) {
          setSelectedDay(prevDay => {
            const revertedDay = { ...prevDay };
            const taskIndex = revertedDay.tasks.findIndex(t => t.taskNumber === taskNumber);
            if (taskIndex !== -1) {
              revertedDay.tasks[taskIndex] = { ...revertedDay.tasks[taskIndex], done: !done };
              // Recalculate progress
              const completedTasks = revertedDay.tasks.filter(t => t.done).length;
              revertedDay.progress = Math.round((completedTasks / revertedDay.tasks.length) * 100);
            }
            return revertedDay;
          });
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      
      // Revert on error
      setData(prevData => updateDataOptimistically(prevData, !done));
      
      if (selectedDay && selectedDay._id === dayId) {
        setSelectedDay(prevDay => {
          const revertedDay = { ...prevDay };
          const taskIndex = revertedDay.tasks.findIndex(t => t.taskNumber === taskNumber);
          if (taskIndex !== -1) {
            revertedDay.tasks[taskIndex] = { ...revertedDay.tasks[taskIndex], done: !done };
            const completedTasks = revertedDay.tasks.filter(t => t.done).length;
            revertedDay.progress = Math.round((completedTasks / revertedDay.tasks.length) * 100);
          }
          return revertedDay;
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Your Roadmap Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Track your progress across all goals and categories</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{data?.totalGoals || 0}</p>
                    <p className="text-gray-600 text-sm">Total Goals</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{data?.categoryStats?.length || 0}</p>
                    <p className="text-gray-600 text-sm">Categories</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-green-200/50 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {data?.categoryStats?.reduce((sum, cat) => sum + cat.completedPlans, 0) || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-orange-200/50 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {data?.categoryStats?.reduce((sum, cat) => sum + cat.avgProgress, 0) / (data?.categoryStats?.length || 1) || 0}%
                    </p>
                    <p className="text-gray-600 text-sm">Avg Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Analytics Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Overview</h2>
            <PerformanceMetrics data={data} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WeeklyProgressChart data={data} />
            <CategoryDistributionChart data={data} />
          </div>
          
          <div className="mb-8">
            <DailyTaskChart data={data} />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.categoryStats?.map((category, index) => (
              <div
                key={category.category}
                onClick={() => setSelectedCategory(category)}
                className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${
                      index % 3 === 0 ? 'from-purple-500 to-pink-500' :
                      index % 3 === 1 ? 'from-blue-500 to-teal-500' :
                      'from-green-500 to-emerald-500'
                    }`}>
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{category.category}</h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Goals</span>
                    <span className="font-semibold text-gray-800">{category.totalPlans}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{category.completedPlans}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Progress</span>
                    <span className="font-semibold text-blue-600">{category.avgProgress}%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        index % 3 === 0 ? 'from-purple-500 to-pink-500' :
                        index % 3 === 1 ? 'from-blue-500 to-teal-500' :
                        'from-green-500 to-emerald-500'
                      } transition-all duration-1000`}
                      style={{ width: `${category.avgProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Category Plans View
  if (selectedCategory && !selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button & Header */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 mb-4 font-semibold transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              <span>Back to Categories</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {selectedCategory.category} Goals
                </h1>
                <p className="text-gray-600 mt-2">{selectedCategory.totalPlans} goals in this category</p>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedCategory.plans.map((plan) => (
              <div
                key={plan._id}
                onClick={() => setSelectedPlan(plan)}
                className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-102"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                    {plan.title}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-300" />
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{plan.stats.totalMonths}</p>
                    <p className="text-sm text-gray-600">Months</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{plan.stats.overallProgress}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                    <span className="text-sm font-bold text-gray-800">{plan.stats.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                      style={{ width: `${plan.stats.overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{plan.stats.completedTasks} / {plan.stats.totalTasks} tasks completed</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {plan.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Plan Months View
  if (selectedPlan && !selectedMonth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button & Header */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedPlan(null)}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 mb-4 font-semibold transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              <span>Back to Plans</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  {selectedPlan.title}
                </h1>
                <p className="text-gray-600 mt-2">{selectedPlan.months.length} months plan</p>
              </div>
            </div>
          </div>

          {/* Months Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedPlan.months.map((month) => {
              const monthProgress = month.weeks.reduce((total, week) => {
                const weekProgress = week.days.reduce((dayTotal, day) => {
                  return dayTotal + day.progress;
                }, 0) / week.days.length;
                return total + weekProgress;
              }, 0) / month.weeks.length || 0;

              return (
                <div
                  key={month._id}
                  onClick={() => setSelectedMonth(month)}
                  className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {month.month}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{month.target}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{month.weeks.length}</p>
                      <p className="text-xs text-gray-600">Weeks</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{Math.round(monthProgress)}%</p>
                      <p className="text-xs text-gray-600">Progress</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-1000"
                      style={{ width: `${monthProgress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Month Weeks View
  if (selectedMonth && !selectedWeek) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button & Header */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedMonth(null)}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 mb-4 font-semibold transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              <span>Back to Months</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedMonth.month}
                </h1>
                <p className="text-gray-600 mt-2">{selectedMonth.weeks.length} weeks in this month</p>
              </div>
            </div>
          </div>

          {/* Weeks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedMonth.weeks.map((week) => {
              const weekProgress = week.days.reduce((total, day) => total + day.progress, 0) / week.days.length || 0;

              return (
                <div
                  key={week._id}
                  onClick={() => setSelectedWeek(week)}
                  className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                      Week {week.weekNumber}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:scale-110 transition-all duration-300" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{week.days.length}</p>
                      <p className="text-xs text-gray-600">Days</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-gray-800">{Math.round(weekProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                        style={{ width: `${weekProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    {week.goals.slice(0, 2).map((goal, i) => (
                      <p key={i} className="truncate">• {goal}</p>
                    ))}
                    {week.goals.length > 2 && <p>+{week.goals.length - 2} more...</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Week Days View
  if (selectedWeek && !selectedDay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button & Header */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedWeek(null)}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 mb-4 font-semibold transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              <span>Back to Weeks</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                  Week {selectedWeek.weekNumber}
                </h1>
                <p className="text-gray-600 mt-2">{selectedWeek.days.length} days in this week</p>
              </div>
            </div>

            {/* Week Goals */}
            <div className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Week Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedWeek.goals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {selectedWeek.days.map((day) => (
              <div
                key={day._id}
                onClick={() => setSelectedDay(day)}
                className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                    {day.dayName}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-lg font-bold text-orange-600">{day.tasks.length}</p>
                    <p className="text-xs text-gray-600">Tasks</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{day.tasks.filter(t => t.done).length}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-800">{day.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
                      style={{ width: `${day.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  {day.tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      {task.done ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-orange-500" />
                      )}
                      <span className={`truncate ${task.done ? 'line-through text-gray-400' : ''}`}>
                        {task.task}
                      </span>
                    </div>
                  ))}
                  {day.tasks.length > 3 && <p className="text-center">+{day.tasks.length - 3} more tasks...</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedDay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setSelectedDay(null)}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 mb-4 font-semibold transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              <span>Back to Days</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                  {selectedDay.dayName}
                </h1>
                <p className="text-gray-600 mt-2">{selectedDay.tasks.length} tasks for today</p>
              </div>
            </div>

            {/* Day Progress Card */}
            <div className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200/50 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Today's Progress</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {selectedDay.tasks.filter(t => t.done).length} / {selectedDay.tasks.length} completed
                  </span>
                  <span className="text-lg font-bold text-pink-600">{selectedDay.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-1000"
                  style={{ width: `${selectedDay.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tasks</h2>
            {selectedDay.tasks.map((task) => (
              <div
                key={task.taskNumber}
                className={`group p-6 rounded-2xl border shadow-lg transition-all duration-300 ${
                  task.done
                    ? 'bg-green-50/80 border-green-200/50 backdrop-blur-sm'
                    : 'bg-white/80 border-gray-200/50 backdrop-blur-sm hover:shadow-xl'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => updateTaskStatus(selectedDay._id, task.taskNumber, !task.done)}
                    className={`mt-1 p-2 rounded-full transition-all duration-300 ${
                      task.done
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-pink-500 hover:text-white'
                    }`}
                  >
                    {task.done ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-current rounded-full"></div>
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        Task #{task.taskNumber}
                      </span>
                      {task.done && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className={`text-lg ${task.done ? 'line-through text-gray-500' : 'text-gray-800'} transition-all duration-300`}>
                      {task.task}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{selectedDay.tasks.length}</p>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-green-200/50 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{selectedDay.tasks.filter(t => t.done).length}</p>
                  <p className="text-gray-600 text-sm">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-orange-200/50 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{selectedDay.tasks.filter(t => !t.done).length}</p>
                  <p className="text-gray-600 text-sm">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return null;
  }
  
  export default Roadmap;



