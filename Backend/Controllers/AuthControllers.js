import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../Model/UserModel.js';


export const Signup = async (req, res) => {
  try {
    const { name, phone, password, email , dob , gender } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(409).json({ msg: 'Phone already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      phone,
      password: hashedPassword,
      dob,
      email,
      gender
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({ success : true, msg: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success : true, msg: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const CheckAuth = async (req, res) => {
  try {
     const token = req.cookies.token;
     if (!token) return res.status(401).json({ msg: 'No token. Auth denied' });

     res.json({success : true})

   } catch (err) {
     res.status(401).json({ msg: 'Token is not valid' });
   }
};


export const Logout = async (req, res) => {
  try {
     const token = req.cookies.token;
     if (!token) return res.status(401).json({ msg: 'No token. Auth denied' });
     res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Lax', 
     })
     res.json({success : true})

   } catch (err) {
     res.status(401).json({ msg: 'Token is not valid' });
   }
};


