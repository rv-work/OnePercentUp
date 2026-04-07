import { GoogleGenAI } from "@google/genai";
import { generatePrompt } from "../Utils/generatePrompt.js";
import { AIModel, MonthModel, WeekModel, DayModel } from "../Model/AIModel.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SetYearGoal = async (req, res) => {
  const { goals, year } = req.body;
  const user = req.user;

  try {
    const allPlans = [];

    for (const goal of goals) {
      const prompt = generatePrompt(goal, year);

      // Using the correct 2026 SDK syntax and gemini-2.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      // Parse the native JSON directly
      const parsed = JSON.parse(response.text);

      const aiPlan = new AIModel({
        userId: user._id,
        year: year,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        currentStatus: goal.currentStatus,
        targetStatus: goal.targetStatus,
        timeAvailble: goal.timeAvailabilityPerDay === "Other" ? goal.customTimeAvailability : goal.timeAvailabilityPerDay,
        pace: goal.preferredPace,
        startDate: goal.startDate,
        endDate: goal.endDate,
        priority: goal.priority,
      });

      for (const monthData of parsed.months) {
        const month = new MonthModel({
          name: monthData.month,
          target: monthData.target,
          plan: aiPlan._id,
        });

        for (const weekData of monthData.weeks) {
          const week = new WeekModel({
            weekNumber: weekData.weekNumber,
            goals: weekData.goals,
            month: month._id,
          });

          // Prepare all days for the week to use bulk insertion
          const dayDocs = Object.entries(weekData.days).map(([dayName, tasks]) => {
            const dayTasks = (Array.isArray(tasks) ? tasks : [tasks]).map((task, index) => ({
              taskNumber: index + 1,
              task,
              done: false,
            }));

            return {
              dayName,
              tasks: dayTasks,
              week: week._id,
            };
          });

          // Bulk insert for significantly better MongoDB performance
          const savedDays = await DayModel.insertMany(dayDocs);
          week.days = savedDays.map(d => d._id);

          await week.save();
          month.weeks.push(week._id);
        }

        await month.save();
        aiPlan.months.push(month._id);
      }

      await aiPlan.save();
      user.yearGoal.push(aiPlan._id);
      allPlans.push(parsed);
    }

    await user.save();

    res.json({
      success: true,
      message: "AI Plans generated and saved successfully using Gemini 2.5.",
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: "AI generation failed" });
  }
};


export const RoadMap = async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch all AI plans for the user with full population
    const detailedPlans = await AIModel.find({ userId })
      .populate({
        path: 'months',
        populate: {
          path: 'weeks',
          populate: {
            path: 'days'
          }
        }
      })
      .sort({ createdAt: -1 });

    // Calculate statistics for each plan
    const plansWithStats = await Promise.all(
      detailedPlans.map(async (plan) => {
        let totalTasks = 0;
        let completedTasks = 0;
        let totalDays = 0;
        let totalWeeks = 0;
        let totalMonths = plan.months.length;

        // Calculate progress statistics
        for (const month of plan.months) {
          totalWeeks += month.weeks.length;
          
          for (const week of month.weeks) {
            for (const day of week.days) {
              totalDays++;
              totalTasks += day.tasks.length;
              completedTasks += day.tasks.filter(task => task.done).length;
            }
          }
        }

        const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...plan.toObject(),
          stats: {
            totalMonths,
            totalWeeks,
            totalDays,
            totalTasks,
            completedTasks,
            overallProgress
          }
        };
      })
    );

    // Group plans by category
    const plansByCategory = plansWithStats.reduce((acc, plan) => {
      const category = plan.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(plan);
      return acc;
    }, {});

    // Calculate category-wise statistics
    const categoryStats = Object.keys(plansByCategory).map(category => {
      const plans = plansByCategory[category];
      const totalPlans = plans.length;
      const completedPlans = plans.filter(plan => plan.stats.overallProgress === 100).length;
      const avgProgress = Math.round(
        plans.reduce((sum, plan) => sum + plan.stats.overallProgress, 0) / totalPlans
      );

      return {
        category,
        totalPlans,
        completedPlans,
        avgProgress,
        plans
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalGoals: plansWithStats.length,
        categoryStats,
        plansByCategory,
        allPlans: plansWithStats
      },
    });

  } catch (error) {
    console.error("Error fetching roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap",
    });
  }
};


export const getPlanDetails = async (req, res) => {
  const { planId } = req.params;
  const userId = req.user._id;

  try {
    const plan = await AIModel.findOne({ _id: planId, userId })
      .populate({
        path: 'months',
        populate: {
          path: 'weeks',
          populate: {
            path: 'days'
          }
        }
      });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    res.status(200).json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error("Error fetching plan details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plan details"
    });
  }
};


export const updateTaskStatus = async (req, res) => {
  const { dayId, taskNumber } = req.params;
  const { done } = req.body;
  const userId = req.user._id;

  try {
    const day = await DayModel.findById(dayId)
      .populate({
        path: 'week',
        populate: {
          path: 'month',
          model: 'MonthPlan',
          populate: {
            path: 'plan',
            model: 'AIPlan',
            match: { userId }
          }
        }
      });

    if (!day || !day.week?.month?.plan) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized"
      });
    }

    const task = day.tasks.find(t => t.taskNumber === parseInt(taskNumber));
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    task.done = done;

    const completedTasks = day.tasks.filter(t => t.done).length;
    day.progress = Math.round((completedTasks / day.tasks.length) * 100);
    day.updatedAt = new Date();

    await day.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: {
        dayProgress: day.progress,
        taskStatus: done
      }
    });

  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status"
    });
  }
};





// Add this inside Usercontrollers.js

export const getDailyTasks = async (req, res) => {
  const userId = req.user._id;
  const { date } = req.query; // User can request a specific date (YYYY-MM-DD)

  try {
    // Agar date aayi hai toh wo use karo, nahi toh aaj ki date
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const activePlans = await AIModel.find({ userId })
      .populate({
        path: 'months',
        populate: {
          path: 'weeks',
          populate: { path: 'days' }
        }
      });

    let todaysTasks = [];

    activePlans.forEach(plan => {
      if (!plan.startDate) return;

      const startDate = new Date(plan.startDate);
      startDate.setHours(0, 0, 0, 0);

      // Calculate the difference in days
      const diffTime = targetDate.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Agar plan start ho chuka hai
      if (diffDays >= 0) {
        // Flatten all days to easily access Day[diffDays]
        const allDays = [];
        plan.months.forEach(month => {
          month.weeks.forEach(week => {
            allDays.push(...week.days);
          });
        });

        // Agar plan abhi khtam nahi hua hai
        if (diffDays < allDays.length) {
          const currentDay = allDays[diffDays];
          todaysTasks.push({
            planId: plan._id,
            planTitle: plan.title,
            category: plan.category,
            dayId: currentDay._id,
            dayName: currentDay.dayName,
            progress: currentDay.progress,
            tasks: currentDay.tasks
          });
        }
      }
    });

    res.status(200).json({
      success: true,
      targetDate: targetDate,
      data: todaysTasks
    });

  } catch (error) {
    console.error("Error fetching daily tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily tasks"
    });
  }
};