import React, { useState, useEffect } from 'react'
import { Target, Briefcase, Heart, Sparkles, ArrowRight, CheckCircle, Star, Calendar, TrendingUp, Award } from 'lucide-react'

const SetGoal = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [goals, setGoals] = useState({
    career: {
      title: '',
      description: '',
      milestones: ['', '', ''],
      priority: 'high'
    },
    health: {
      title: '',
      description: '',
      milestones: ['', '', ''],
      priority: 'high'
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const goalTypes = [
    {
      key: 'career',
      title: 'Career Goals',
      subtitle: 'Shape your professional future',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      examples: ['Become a Senior Developer', 'Start my own business', 'Get promoted to Team Lead']
    },
    {
      key: 'health',
      title: 'Health Goals',
      subtitle: 'Transform your wellbeing',
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      bgColor: 'from-pink-500/20 to-red-500/20',
      examples: ['Lose 20kg weight', 'Run a marathon', 'Build muscle strength']
    }
  ]

  const handleGoalChange = (type, field, value, index = null) => {
    setGoals(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: index !== null 
          ? prev[type][field].map((item, i) => i === index ? value : item)
          : value
      }
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/user/set-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goals: goals,
          timeframe: '5_years'
        })
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          // Redirect to dashboard or next page
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        throw new Error('Failed to submit goals')
      }
    } catch (error) {
      console.error('Error submitting goals:', error)
      alert('Failed to submit goals. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return goals.career.title.trim() !== '' && 
           goals.career.description.trim() !== '' &&
           goals.health.title.trim() !== '' && 
           goals.health.description.trim() !== '' &&
           goals.career.milestones.some(m => m.trim() !== '') &&
           goals.health.milestones.some(m => m.trim() !== '')
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Goals Set Successfully! 🎉</h2>
          <p className="text-gray-400 text-lg">Redirecting you to your dashboard...</p>
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className={`max-w-4xl mx-auto w-full transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-6">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Set Your 5-Year Vision</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
              Design Your Future
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Let's create a roadmap for your success. Define your career and health goals for the next 5 years.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {goalTypes.map((_, index) => (
                <React.Fragment key={index}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < goalTypes.length - 1 && (
                    <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                      index < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Goal Forms */}
          <div className="space-y-8">
            {goalTypes.map((goalType, typeIndex) => {
              const IconComponent = goalType.icon
              const isActive = currentStep === typeIndex
              
              return (
                <div 
                  key={goalType.key}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 transition-all duration-500 ${
                    isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60 pointer-events-none'
                  }`}
                >
                  {/* Goal Type Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${goalType.color}`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{goalType.title}</h2>
                      <p className="text-gray-400 text-lg">{goalType.subtitle}</p>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="mb-8">
                    <p className="text-gray-400 mb-3">Popular examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {goalType.examples.map((example, i) => (
                        <button
                          key={i}
                          onClick={() => handleGoalChange(goalType.key, 'title', example)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Goal Title */}
                      <div>
                        <label className="block text-white font-semibold mb-3 text-lg">
                          🎯 Main Goal
                        </label>
                        <input
                          type="text"
                          value={goals[goalType.key].title}
                          onChange={(e) => handleGoalChange(goalType.key, 'title', e.target.value)}
                          placeholder={`What's your main ${goalType.key} goal?`}
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Goal Description */}
                      <div>
                        <label className="block text-white font-semibold mb-3 text-lg">
                          📝 Description
                        </label>
                        <textarea
                          value={goals[goalType.key].description}
                          onChange={(e) => handleGoalChange(goalType.key, 'description', e.target.value)}
                          placeholder="Describe your goal in detail. Why is this important to you?"
                          rows={4}
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-white font-semibold mb-3 text-lg">
                          ⭐ Priority Level
                        </label>
                        <div className="flex gap-3">
                          {['high', 'medium', 'low'].map((priority) => (
                            <button
                              key={priority}
                              onClick={() => handleGoalChange(goalType.key, 'priority', priority)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                goals[goalType.key].priority === priority
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

                    {/* Right Column - Milestones */}
                    <div>
                      <label className="block text-white font-semibold mb-3 text-lg">
                        🚀 Key Milestones (Next 5 Years)
                      </label>
                      <div className="space-y-4">
                        {goals[goalType.key].milestones.map((milestone, index) => (
                          <div key={index} className="relative">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <input
                                type="text"
                                value={milestone}
                                onChange={(e) => handleGoalChange(goalType.key, 'milestones', e.target.value, index)}
                                placeholder={`Milestone ${index + 1} (Year ${index + 1}-${index + 2})`}
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-4">
              {currentStep < goalTypes.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1"
                >
                  Next Step
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting}
                  className={`group px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg transform hover:-translate-y-1 ${
                    isFormValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white hover:shadow-green-500/25'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Setting Goals...
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      Set My Goals
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Step {currentStep + 1} of {goalTypes.length}
            </p>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / goalTypes.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetGoal