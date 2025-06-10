import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatePrompt } from "../Utils/generatePrompt.js";
import { AIModel, MonthModel, WeekModel, DayModel } from "../Model/AIModel.js"


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



export const SetYearGoal = async (req, res) => {
  const { goals, year } = req.body;
  const user = req.user;

  console.log("data from frontend:", goals, "\nyear:", year);
  console.log("user:", user);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const chat = model.startChat();

    const allPlans = [];

    for (const goal of goals) {
      const prompt = generatePrompt(goal, year);
      const result = await chat.sendMessage(prompt);
      let response = await result.response.text();

      if (response.startsWith("```")) {
        response = response.replace(/```json|```/g, "").trim();
      }

      const parsed = JSON.parse(response);

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

          for (const [dayName, tasks] of Object.entries(weekData.days)) {
            const dayTasks = (Array.isArray(tasks) ? tasks : [tasks]).map((task, index) => ({
              taskNumber: index + 1,
              task,
              done: false,
            }));

            const day = new DayModel({
              dayName,
              tasks: dayTasks,
              week: week._id,
            });

            await day.save();
            week.days.push(day._id);
          }

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
      message: "AI Plans generated and saved successfully.",
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

// Additional controller for getting specific plan details
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
  console.log("1st")


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

  console.log("2nd")
  console.log("day : " , day)


    if (!day || !day.week?.month?.plan) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized"
      });
    }

  console.log("3rd")


    const task = day.tasks.find(t => t.taskNumber === parseInt(taskNumber));
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

  console.log("4th")


    task.done = done;

    const completedTasks = day.tasks.filter(t => t.done).length;
    day.progress = Math.round((completedTasks / day.tasks.length) * 100);
    day.updatedAt = new Date();

  console.log("5th")


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


// export const RoadMap = async (req, res) => {
//   const user = req.user;

//   try {
//     const plans = await AIModel.find({ userId: user._id }).populate("months");
//     const allGoals = [];

//     for (const plan of plans) {
//       const aiPlan = {
//         monthlyBreakdown: [],
//         weeklyBreakdown: [],
//         dailyTasks: []
//       };

//       for (const month of plan.months) {
//         await month.populate("weeks");

//         aiPlan.monthlyBreakdown.push({
//           month: new Date(`${month.name} 1, ${plan.year}`).getMonth() + 1,
//           monthName: month.name,
//           target: month.target,
//           tasks: month.weeks.flatMap(week =>
//             week.goals
//           ),
//           progress: Math.floor(
//             (
//               weekProgressAverage(month.weeks) || 0
//             )
//           )
//         });

//         for (const week of month.weeks) {
//           await week.populate("days");

//           // Weekly Breakdown
//           aiPlan.weeklyBreakdown.push({
//             week: week.weekNumber,
//             month: new Date(`${month.name} 1, ${plan.year}`).getMonth() + 1,
//             tasks: week.goals,
//             focus: week.goals.length > 0 ? week.goals[0] : "General",
//             completed: week.days.reduce(
//               (acc, day) => acc + day.tasks.filter(t => t.done).length,
//               0
//             ),
//             total: week.days.reduce(
//               (acc, day) => acc + day.tasks.length,
//               0
//             )
//           });

//           // Daily Breakdown
//           for (const day of week.days) {
//             aiPlan.dailyTasks.push({
//               date: new Date(), // optionally adjust to align with the goal timeline
//               tasks: day.tasks.map(t => t.task),
//               completed: day.tasks.every(t => t.done)
//             });
//           }
//         }
//       }

//       allGoals.push({
//         id: plan._id,
//         category: plan.category,
//         title: plan.title,
//         currentStatus: plan.currentStatus,
//         targetStatus: plan.targetStatus,
//         priority: plan.priority,
//         progress: {
//           currentProgress: calculateOverallProgress(aiPlan.monthlyBreakdown),
//         },
//         status: "active",
//         aiPlan
//       });
//     }

//     const categoryProgress = {};
//     for (const goal of allGoals) {
//       categoryProgress[goal.category] = goal.progress.currentProgress;
//     }

//     const response = {
//       userId: user._id,
//       year: plans[0]?.year || new Date().getFullYear(),
//       goals: allGoals,
//       yearStats: {
//         totalGoals: allGoals.length,
//         completedGoals: 0,
//         activeGoals: allGoals.length,
//         overallProgress: Math.floor(
//           allGoals.reduce((sum, g) => sum + g.progress.currentProgress, 0) / (allGoals.length || 1)
//         ),
//         categoryWiseProgress: categoryProgress
//       }
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("RoadMap Error:", error);
//     res.status(500).json({ success: false, error: "Failed to fetch roadmap" });
//   }
// };

// // Helpers
// const calculateOverallProgress = (monthlyBreakdown) => {
//   if (!monthlyBreakdown.length) return 0;
//   const sum = monthlyBreakdown.reduce((acc, month) => acc + (month.progress || 0), 0);
//   return Math.floor(sum / monthlyBreakdown.length);
// };

// const weekProgressAverage = (weeks) => {
//   const total = weeks.reduce((acc, week) => {
//     return acc + week.days.reduce((a, d) => {
//       const tasks = Array.isArray(d.tasks) ? d.tasks : [];
//       const done = tasks.filter(t => t.done).length;
//       const totalTasks = tasks.length;
//       return a + (totalTasks ? (done / totalTasks) * 100 : 0);
//     }, 0);
//   }, 0);

//   const totalDays = weeks.reduce((acc, week) => acc + week.days.length, 0);
//   return totalDays ? total / totalDays : 0;
// };
