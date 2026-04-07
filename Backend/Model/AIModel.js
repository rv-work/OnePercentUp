import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  dayName : String,
  tasks : [{
    taskNumber : Number,
    task : String,
    done : {
     type : Boolean,
     default : false,
    },
  }],
  progress: {
  type: Number, 
  default: 0,
  },
  week : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'WeekPlan'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt : {
    type: Date,
    default: Date.now
  }
},{timestamps : true} );





const weekSchema = new mongoose.Schema({
  weekNumber: Number,
  goals: [String],
  days: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'DayPlan'
  }],
  month : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'MonthPlan'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt : {
    type: Date,
    default: Date.now
  }
} ,{timestamps : true} );





const monthSchema = new mongoose.Schema({
  month: String,
  target: String,
  weeks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'WeekPlan'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt : {
    type: Date,
    default: Date.now
  },
  plan : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'AIPlan'
  }

}, {timestamps : true} );





const aiPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  title: String,
  category: String,
  year : String,
  description :String,
  currentStatus :String,
  targetStatus :String,
  timeAvailble :String,
  pace : String,
  startDate : Date,
  endDate : Date,
  priority : String,

  months: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'MonthPlan'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt : {
    type: Date,
    default: Date.now
  }
} , {timestamps : true});






export const AIModel = mongoose.model('AIPlan', aiPlanSchema);
export const MonthModel = mongoose.model('MonthPlan', monthSchema);
export const WeekModel = mongoose.model('WeekPlan', weekSchema);
export const DayModel = mongoose.model('DayPlan', daySchema);



