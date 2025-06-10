import React, { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Target, Plus, X, BookOpen, Dumbbell, Code, Briefcase, Heart, DollarSign, Users, Star, ArrowRight, CheckCircle, Award, Sparkles } from 'lucide-react'

const YearSet = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [goals, setGoals] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setIsVisible(true)
  }, [])


  const useTimeLeftInYear = () => {
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0 })

  useEffect(() => {
    const today = new Date()
    const endOfYear = new Date(today.getFullYear(), 11, 31)

    

    let monthsLeft = endOfYear.getMonth() - today.getMonth()
    let daysLeft = endOfYear.getDate() - today.getDate()

    if (daysLeft < 0) {
      monthsLeft -= 1
      const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() + monthsLeft + 1, 0).getDate()
      daysLeft = lastDayOfPrevMonth + daysLeft
    }

    setTimeLeft({ monthsLeft, daysLeft })
  }, [])

  return timeLeft
}

  const { monthsLeft, daysLeft } = useTimeLeftInYear()

  const categoryOptions = [
    { 
      key: 'tech', 
      label: 'Technology/Programming', 
      icon: Code, 
      color: 'from-blue-500 to-cyan-500',
      examples: ['Learn React Native', 'Master Python', 'Build 5 Projects']
    },
    { 
      key: 'career', 
      label: 'Career Growth', 
      icon: Briefcase, 
      color: 'from-purple-500 to-indigo-500',
      examples: ['Get Promotion', 'Switch Job', 'Start Freelancing']
    },
    { 
      key: 'health', 
      label: 'Health & Fitness', 
      icon: Heart, 
      color: 'from-pink-500 to-red-500',
      examples: ['Lose 15kg', 'Run 5K', 'Gym 5 days/week']
    },
    { 
      key: 'finance', 
      label: 'Financial Goals', 
      icon: DollarSign, 
      color: 'from-green-500 to-emerald-500',
      examples: ['Save ₹50,000', 'Start SIP', 'Clear Debt']
    },
    { 
      key: 'learning', 
      label: 'Learning & Skills', 
      icon: BookOpen, 
      color: 'from-orange-500 to-amber-500',
      examples: ['Read 12 Books', 'Learn Guitar', 'Get Certification']
    },
    { 
      key: 'social', 
      label: 'Personal & Social', 
      icon: Users, 
      color: 'from-teal-500 to-cyan-500',
      examples: ['Travel 3 Places', 'Make New Friends', 'Learn Language']
    }
  ]

  const addGoal = () => {
    const newGoal = {
      id : Date.now(),
      category: '',
      title: '',
      description : '',
      currentStatus: '',
      targetStatus: '',
      priority: 'medium',
      startDate : '',
      endDate : '',
      timeAvailabilityPerDay : '', 
      preferredPace: '' 
    }
    setGoals([...goals, newGoal])
  }

  const removeGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const updateGoal = (id, field, value) => {
  setGoals((prevGoals) =>
    prevGoals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            [field]: value,
            ...(field === 'timeAvailabilityPerDay' && value !== 'Other'
              ? { customTimeAvailability: '' } 
              : {}),
          }
        : goal
    )
  );
};


  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/user/year-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goals: goals,
          year: currentYear
        }),
        credentials : "include"
      })

      const data = await response.json()

      if (data.success) {
        alert("safal rha")
        setSubmitSuccess(true)
        // setTimeout(() => {
        //   window.location.href = '/dashboard'
        // }, 2000)
        console.log("data :" , data)
        console.log("good")
      } else {
        throw new Error('Failed to submit year goals')
      }
    } catch (error) {
      console.error('Error submitting year goals:', error)
      alert('Failed to submit goals. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return goals.length > 0 && goals.every(goal => 
      goal.category && goal.title.trim() && goal.currentStatus.trim() && goal.targetStatus.trim()
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Year Goals Set Successfully! 🎯</h2>
          <p className="text-gray-400 text-lg">Your AI-powered plan is being generated...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className={`max-w-6xl mx-auto w-full transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-6">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Year {currentYear} Goals</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
              Transform This Year
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Set your goals for {currentYear}. Tell us where you are now and where you want to be by year-end.
            </p>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                <div className="text-2xl font-bold text-white">{monthsLeft} Months &</div>
                <div className="text-gray-400 text-sm"> {daysLeft} Days Left</div>
             
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                <div className="text-2xl font-bold text-white">{Math.round((monthsLeft / 12) * 100)}%</div>
                <div className="text-gray-400 text-sm">Year Remaining</div>
              </div>
            </div>
          </div>

       
          <div className="space-y-8">
            {goals.map((goal, index) => {
              const selectedCategory = categoryOptions.find(cat => cat.key === goal.category)
              const IconComponent = selectedCategory?.icon || Target
              
              return (
                <div 
                  key={goal.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transform transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedCategory?.color || 'from-gray-500 to-gray-600'}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Goal #{index + 1}</h3>
                        <p className="text-gray-400">{selectedCategory?.label || 'Select Category'}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Category Selection */}
                      <div>
                        <label className="block text-white font-semibold mb-3">
                          Category
                        </label>
                        <select
                          value={goal.category}
                          onChange={(e) => updateGoal(goal.id, 'category', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="" className="bg-slate-800">Select a category</option>
                          {categoryOptions.map(category => (
                            <option key={category.key} value={category.key} className="bg-slate-800">
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick Examples */}
                      {selectedCategory && (
                        <div>
                          <p className="text-gray-400 mb-2 text-sm">Quick examples:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCategory.examples.map((example, i) => (
                              <button
                                key={i}
                                onClick={() => updateGoal(goal.id, 'title', example)}
                                className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs text-gray-300 hover:text-white transition-all duration-200"
                              >
                                {example}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Goal Title */}
                      <div>
                        <label className="block text-white font-semibold mb-3">
                           What do you want to achieve?
                        </label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                          placeholder="e.g., Learn MERN Stack, Lose 15kg, Save ₹50,000"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>


                      <div>
                        <label className="block text-white font-semibold mb-3">
                           Provide A Short Description?
                        </label>
                        <textarea
                          type="text"
                          rows={3}
                          value={goal.description}
                          onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                          placeholder="e.g., Learn MERN Stack, Lose 15kg, Save ₹50,000"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-3">
                           Start Date
                        </label>
                        <input
                          type="Date"
                          value={goal.startDate}
                          onChange={(e) => updateGoal(goal.id, 'startDate', e.target.value)}
                          placeholder="e.g., kg, ₹, projects, books, hours"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-3">
                           End Date 
                        </label>
                        <input
                          type="Date"
                          value={goal.endDate}
                          onChange={(e) => updateGoal(goal.id, 'endDate', e.target.value)}
                          placeholder="e.g., kg, ₹, projects, books, hours"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-white font-semibold mb-3">
                           Priority Level
                        </label>
                        <div className="flex gap-2">
                          {['high', 'medium', 'low'].map((priority) => (
                            <button
                              key={priority}
                              onClick={() => updateGoal(goal.id, 'priority', priority)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                                goal.priority === priority
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Status */}
                    <div className="space-y-6">
                      {/* Current Status */}
                      <div>
                        <label className="block text-white font-semibold mb-3">
                           Current Status (Where you are now)
                        </label>
                        <textarea
                          value={goal.currentStatus}
                          onChange={(e) => updateGoal(goal.id, 'currentStatus', e.target.value)}
                          placeholder="e.g., Know basic HTML/CSS, Weight 75kg, Have ₹10,000 savings"
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-3">
                           Target Status (Where you want to be)
                        </label>
                        <textarea
                          value={goal.targetStatus}
                          onChange={(e) => updateGoal(goal.id, 'targetStatus', e.target.value)}
                          placeholder="e.g., Build full-stack apps, Weight 60kg, Have ₹60,000 savings"
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>

                     <div>
                        <label className="block text-white font-semibold mb-3">
                          Time Availability Per Day
                        </label>
                        <select
                          value={goal.timeAvailabilityPerDay}
                          onChange={(e) => updateGoal(goal.id, 'timeAvailabilityPerDay', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option className='bg-slate-800' value="">Select time</option>
                          <option className='bg-slate-800' value="1 hr">1 hr</option>
                          <option className='bg-slate-800' value="2 hr">2 hr</option>
                          <option className='bg-slate-800' value="3 hr">3 hr</option>
                          <option className='bg-slate-800' value="4 hr">4 hr</option>
                          <option className='bg-slate-800' value="Other">Other</option>
                        </select>
                      
                        {goal.timeAvailabilityPerDay === 'Other' && (
                          <input
                            type="text"
                            value={goal.customTimeAvailability || ''}
                            onChange={(e) => updateGoal(goal.id, 'customTimeAvailability', e.target.value)}
                            placeholder="Specify time (e.g., 5 hr, flexible)"
                            className="mt-3 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-3">
                          Pace
                        </label>
                        <select
                          value={goal.preferredPace}
                          onChange={(e) => updateGoal(goal.id, 'preferredPace', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option className='bg-slate-800' value="">Select pace</option>
                          <option className='bg-slate-800' value="Light">Light</option>
                          <option className='bg-slate-800' value="Medium">Medium</option>
                          <option className='bg-slate-800' value="Aggressive">Aggressive</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}

            <div className="text-center">
              <button
                onClick={addGoal}
                className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 mx-auto hover:scale-105"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                Add Another Goal
              </button>
            </div>
          </div>

          {goals.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">Ready to Transform {currentYear}?</h3>
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-300 text-lg mb-6">
                  Our AI will create a personalized month-by-month, week-by-week action plan to help you achieve these goals.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-white">{goals.length}</div>
                    <div className="text-gray-300 text-sm">Goals Set</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-white">{monthsLeft}</div>
                    <div className="text-gray-300 text-sm">Months to Go</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-white">∞</div>
                    <div className="text-gray-300 text-sm">Possibilities</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`group px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-4 mx-auto shadow-2xl transform hover:-translate-y-2 ${
                  isFormValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white hover:shadow-green-500/25 scale-100'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed scale-95'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Your AI Plan...
                  </>
                ) : (
                  <>
                    <Award className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Generate My {currentYear} Action Plan
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>

              {!isFormValid() && goals.length > 0 && (
                <p className="text-yellow-400 mt-4">
                  Please fill in all required fields for each goal to continue
                </p>
              )}
            </div>
          )}

          {goals.length === 0 && (
            <div className="text-center mt-16">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Set Your First Goal?</h3>
              <p className="text-gray-400 mb-8">Click "Add Another Goal" above to get started on your {currentYear} transformation journey!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YearSet