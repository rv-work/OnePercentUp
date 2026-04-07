import React, { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  Target,
  Plus,
  X,
  BookOpen,
  Code,
  Briefcase,
  Heart,
  DollarSign,
  Users,
  ArrowRight,
  CheckCircle,
  Award,
  Sparkles,
  Activity,
  Shield,
  Zap,
} from "lucide-react";

const YearSet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const useTimeLeftInYear = () => {
    const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0 });

    useEffect(() => {
      const today = new Date();
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      let monthsLeft = endOfYear.getMonth() - today.getMonth();
      let daysLeft = endOfYear.getDate() - today.getDate();

      if (daysLeft < 0) {
        monthsLeft -= 1;
        const lastDayOfPrevMonth = new Date(
          today.getFullYear(),
          today.getMonth() + monthsLeft + 1,
          0,
        ).getDate();
        daysLeft = lastDayOfPrevMonth + daysLeft;
      }

      setTimeLeft({ monthsLeft, daysLeft });
    }, []);

    return timeLeft;
  };

  const { monthsLeft, daysLeft } = useTimeLeftInYear();

  const categoryOptions = [
    {
      key: "tech",
      label: "Technology/Programming",
      icon: Code,
      color: "from-blue-500 to-indigo-500",
      examples: ["Learn React Native", "Master Python", "Build 5 Projects"],
    },
    {
      key: "career",
      label: "Career Growth",
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
      examples: ["Get Promotion", "Switch Job", "Start Freelancing"],
    },
    {
      key: "health",
      label: "Health & Fitness",
      icon: Heart,
      color: "from-rose-500 to-red-500",
      examples: ["Lose 15kg", "Run 5K", "Gym 5 days/week"],
    },
    {
      key: "finance",
      label: "Financial Goals",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      examples: ["Save ₹50,000", "Start SIP", "Clear Debt"],
    },
    {
      key: "learning",
      label: "Learning & Skills",
      icon: BookOpen,
      color: "from-orange-500 to-amber-500",
      examples: ["Read 12 Books", "Learn Guitar", "Get Certification"],
    },
    {
      key: "social",
      label: "Personal & Social",
      icon: Users,
      color: "from-cyan-500 to-blue-500",
      examples: ["Travel 3 Places", "Make New Friends", "Learn Language"],
    },
  ];

  const addGoal = () => {
    const newGoal = {
      id: Date.now(),
      category: "",
      title: "",
      description: "",
      currentStatus: "",
      targetStatus: "",
      priority: "medium",
      startDate: "",
      endDate: "",
      timeAvailabilityPerDay: "",
      preferredPace: "",
    };
    setGoals([...goals, newGoal]);
  };

  const removeGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const updateGoal = (id, field, value) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              [field]: value,
              ...(field === "timeAvailabilityPerDay" && value !== "Other"
                ? { customTimeAvailability: "" }
                : {}),
            }
          : goal,
      ),
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/user/year-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: goals, year: currentYear }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        console.log("data :", data);
      } else {
        throw new Error("Failed to submit year goals");
      }
    } catch (error) {
      console.error("Error submitting year goals:", error);
      alert("Failed to submit goals. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      goals.length > 0 &&
      goals.every(
        (goal) =>
          goal.category &&
          goal.title.trim() &&
          goal.currentStatus.trim() &&
          goal.targetStatus.trim() &&
          goal.startDate &&
          goal.endDate,
      )
    );
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 pointer-events-none"></div>
        <div className="text-center relative z-10 p-12 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Mission Locked 🎯
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Your goals are set. Our AI is now crafting your personalized,
            step-by-step master plan.
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-purple-500/30 overflow-hidden relative pb-24">
      {/* Deep Space Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 pt-32 px-4 max-w-5xl mx-auto">
        <div
          className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">
                Year {currentYear} Master Plan
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Design Your <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Evolution.
              </span>
            </h1>

            {/* Time Left Widget */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">
                    {monthsLeft}m {daysLeft}d
                  </div>
                  <div className="text-gray-500 text-sm font-medium">
                    Time Remaining
                  </div>
                </div>
              </div>
              <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">
                    {Math.round((monthsLeft / 12) * 100)}%
                  </div>
                  <div className="text-gray-500 text-sm font-medium">
                    Year Left
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-8">
            {goals.map((goal, index) => {
              const selectedCategory = categoryOptions.find(
                (cat) => cat.key === goal.category,
              );
              const IconComponent = selectedCategory?.icon || Target;

              return (
                <div
                  key={goal.id}
                  className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative group transition-all hover:border-white/20"
                >
                  {/* Goal Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-br ${selectedCategory?.color || "from-gray-700 to-gray-800"} shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-purple-400 mb-1">
                          Target #{index + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {goal.title || "New Objective"}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all self-end sm:self-auto"
                      title="Remove Goal"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Left Column - Strategy */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                        <Target className="w-5 h-5 text-indigo-400" /> Goal
                        Definition
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Category
                        </label>
                        <div className="relative">
                          <select
                            value={goal.category}
                            onChange={(e) =>
                              updateGoal(goal.id, "category", e.target.value)
                            }
                            className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                          >
                            <option
                              value=""
                              className="bg-[#0a0a0f] text-gray-500"
                            >
                              Select a domain
                            </option>
                            {categoryOptions.map((cat) => (
                              <option
                                key={cat.key}
                                value={cat.key}
                                className="bg-[#0a0a0f]"
                              >
                                {cat.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Primary Objective
                        </label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) =>
                            updateGoal(goal.id, "title", e.target.value)
                          }
                          placeholder="e.g., Master Advanced React"
                          className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                        {selectedCategory && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedCategory.examples.map((example, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  updateGoal(goal.id, "title", example)
                                }
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-all"
                              >
                                {example}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Brief Context (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={goal.description}
                          onChange={(e) =>
                            updateGoal(goal.id, "description", e.target.value)
                          }
                          placeholder="Why is this important to you?"
                          className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Right Column - Execution */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                        <Zap className="w-5 h-5 text-pink-400" /> Execution Plan
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Current Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Current State
                          </label>
                          <textarea
                            value={goal.currentStatus}
                            onChange={(e) =>
                              updateGoal(
                                goal.id,
                                "currentStatus",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Beginner level"
                            rows={2}
                            className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                          />
                        </div>

                        {/* Target Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Target State
                          </label>
                          <textarea
                            value={goal.targetStatus}
                            onChange={(e) =>
                              updateGoal(
                                goal.id,
                                "targetStatus",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Build 3 complex apps"
                            rows={2}
                            className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={goal.startDate}
                            onChange={(e) =>
                              updateGoal(goal.id, "startDate", e.target.value)
                            }
                            className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all [color-scheme:dark]"
                          />
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={goal.endDate}
                            onChange={(e) =>
                              updateGoal(goal.id, "endDate", e.target.value)
                            }
                            className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Time Availability */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Daily Commitment
                          </label>
                          <div className="relative">
                            <select
                              value={goal.timeAvailabilityPerDay}
                              onChange={(e) =>
                                updateGoal(
                                  goal.id,
                                  "timeAvailabilityPerDay",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                            >
                              <option
                                value=""
                                className="bg-[#0a0a0f] text-gray-500"
                              >
                                Select time
                              </option>
                              {[
                                "30 min",
                                "1 hr",
                                "2 hr",
                                "3 hr",
                                "4+ hr",
                                "Other",
                              ].map((t) => (
                                <option
                                  key={t}
                                  value={t}
                                  className="bg-[#0a0a0f]"
                                >
                                  {t}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Pace */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Intensity
                          </label>
                          <div className="relative">
                            <select
                              value={goal.preferredPace}
                              onChange={(e) =>
                                updateGoal(
                                  goal.id,
                                  "preferredPace",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                            >
                              <option
                                value=""
                                className="bg-[#0a0a0f] text-gray-500"
                              >
                                Select pace
                              </option>
                              <option value="Light" className="bg-[#0a0a0f]">
                                Light & Steady
                              </option>
                              <option value="Medium" className="bg-[#0a0a0f]">
                                Moderate
                              </option>
                              <option
                                value="Aggressive"
                                className="bg-[#0a0a0f]"
                              >
                                Aggressive
                              </option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Priority Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Priority Level
                        </label>
                        <div className="flex gap-2">
                          {["low", "medium", "high"].map((priority) => (
                            <button
                              key={priority}
                              onClick={() =>
                                updateGoal(goal.id, "priority", priority)
                              }
                              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                goal.priority === priority
                                  ? priority === "high"
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/50"
                                    : priority === "medium"
                                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                                  : "bg-black/50 text-gray-500 border border-white/5 hover:bg-white/5"
                              }`}
                            >
                              {priority.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State / Add Goal Button */}
            {goals.length === 0 ? (
              <div className="text-center py-20 px-6 border-2 border-dashed border-white/10 rounded-[2rem] bg-[#0a0a0f]/50 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Blank Canvas
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  You haven't set any objectives yet. Click below to start
                  architecting your ultimate year.
                </p>
                <button
                  onClick={addGoal}
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-all duration-300 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Create First Target
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={addGoal}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Add Another Target
                </button>
              </div>
            )}
          </div>

          {/* Submit Section */}
          {goals.length > 0 && (
            <div className="mt-16 bg-[#0a0a0f] border border-white/10 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>

              <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Initialize Master Plan
              </h3>
              <p className="text-gray-400 max-w-xl mx-auto mb-10">
                Once submitted, our AI engine will analyze your inputs and
                generate a highly optimized, day-by-day execution strategy to
                guarantee your success.
              </p>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full max-w-md mx-auto py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl ${
                  isFormValid() && !isSubmitting
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:-translate-y-1"
                    : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Synthesizing Plan...
                  </>
                ) : (
                  <>
                    <Award className="w-6 h-6" />
                    Generate AI Roadmap
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {!isFormValid() && (
                <p className="text-yellow-500/80 text-sm mt-6 font-medium">
                  * Please complete all fields for your defined targets to
                  proceed.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearSet;
