export const generatePrompt = (goal, year) => {
  return `
You are a helpful AI productivity assistant specializing in the "${goal.category}" category.

The user has submitted a yearly goal with the following information:

- 🏷️ Title: ${goal.title}
-     Description : ${goal.description}
- 📍 Current Status: ${goal.currentStatus}
- 🎯 Target Status: ${goal.targetStatus}
- 🕒 Time Availability Per Day: ${goal.timeAvailabilityPerDay === "Other" ? goal.customTimeAvailability : goal.timeAvailabilityPerDay}
- ⚡ Preferred Pace: ${goal.preferredPace}
- 📅 Start Date: ${goal.startDate}
- 📅 End Date: ${goal.endDate}

start from start date to Continue the plan **month by month** until the end of date.

---

📌 Your Task:
Break this yearly goal into a structured, actionable plan with:
- A **monthly breakdown** (from start date to end date)
- For each month:
  - A target overview
  - 4 weeks of goals
  - Daily breakdown (Mon to Sun)
  - also break a full day into 4-5 subtasks

Ensure the pacing aligns with user’s time availability and preferred pace.

---

Respond in **valid JSON only** (no markdown or explanation). Use this structure:

{
  "title": "${goal.title}",
  "category": "${goal.category}",
  "months": [
    {
      "month": "Month Name",
      "target": "Target focus for the month",
      "weeks": [
        {
          "weekNumber": 1,
          "goals": ["Subtask 1", "Subtask 2",.....],
          "days": {
            "Monday": ["Task 1" , "Task 2" , "Task 3" "Task 4" , "Task 5" , .......],
            "Tuesday": ["Task 1" , "Task 2" , "Task 3" "Task 4" , "Task 5" , .......],
            "Wednesday": ["Task 1" , "Task 2" , "Task 3" "Task 4" , "Task 5" , .......],
            "Thursday": ["Task 1" , "Task 2" , "Task 3" "Task 4" , "Task 5" , .......],
            "Friday": ["Task 1" , "Task 2" , "Task 3" "Task 4" , "Task 5" , .......],
            "Saturday": ["Task 1" , "Task 2" , "Task 3" "Task 4" , "Task 5" , .......],
            "Sunday": "Rest or Review"
          }
        }
      ]
    }
  ]
}

Only return valid JSON matching the above format.
`;
};
