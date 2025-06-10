import express from 'express';
import { RoadMap, SetYearGoal, updateTaskStatus } from '../Controllers/Usercontrollers.js';
import {verifyToken} from "../Middleware/Verify.js"

const userRouter = express.Router();

userRouter.post('/year-goal', verifyToken ,  SetYearGoal);
userRouter.get('/roadmap', verifyToken ,  RoadMap);
userRouter.put('/task/:dayId/:taskNumber', verifyToken ,  updateTaskStatus);


export default userRouter;
