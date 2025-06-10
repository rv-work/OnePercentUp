import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob : {
    type : Date,
    required : true,
  },
  gender : {
    type : String,
    required : true,
  },
  yearGoal : [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AIPlan'
  }]

}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export { UserModel };
