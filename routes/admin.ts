import jwt from 'jsonwebtoken';
import  express from 'express';
import mongoose, { mongo }  from "mongoose";

import { User, Admin, Course } from '../db';
import { SECRET, authenticateJwt } from '../middleware';
import { CourseRequestBody  } from '../types/type';
const router = express.Router();
const generateJwt = (userId:mongoose.Types.ObjectId)=>{
    const token  = jwt.sign({id:userId},SECRET, { expiresIn: '1h' })
    return token;
}

router.post('/signup', async (req, res)=>{
    if(!req.body || !req.body.username || !req.body.password){
        res.status(401).json({message:"username and password are mandatory"})
    }
    const {username, password} = req.body;
    console.log("username admin 1", username)
    const user = await User.findOne({username})
    console.log(typeof user)
    if(user){
        res.status(400).json({message: "user already exist pls log in"})
    }
    else{
        const newUser  =  new User({
            username,password
        })
        await newUser.save();
        console.log("newUser admin 1", newUser)
        //generate token
        const token = generateJwt(newUser._id)
        res.status(200).json({message:'Token has successfully generated', token:token})
    }    


})

router.post('/signin', async ( req, res)=>{
    const {username, password}= req.headers;
    //check for user exists or not
    const user = await User.findOne({username, password})
    if(!user){
        res.status(400).json({message:`this ${username} doesnt exists `})
    }
    else{
        const token = generateJwt(user._id)
        res.status(200).json({message:`logged in successfully`, token:token})
    }
})

//add course
router.post('/courses', authenticateJwt, async (req, res)=>{
    let course:CourseRequestBody = req.body;
    console.log("courses create courese api", course)
    if(!course){
        console.log("culprit")
        res.status(400).json({message:"request body is required"})
    }else{
    const newCourse  = new Course(course)
    await newCourse.save();
    console.log("newCourse create courese api", newCourse)
    res.status(201).json({message:"course has successfully created", courseId:newCourse._id})
    }
})

router.put('/courses/:courseId', authenticateJwt,async (req, res)=>{
    let updateCourese:CourseRequestBody =req.body;
    console.log("update courses put", updateCourese)
    let courese = await Course.findOne({_id:req.params.courseId})
    if(!courese){
        return res.status(404).json({message:"course doesnt exists"})
    }
    console.log("courese courses put", courese)
    await Course.findByIdAndUpdate({_id: req.params.courseId},updateCourese)
    let course = await Course.findOne({_id:req.params.courseId})
    console.log("course after courses put", course)
    console.log("updated course", course)
    res.status(200).json({message:"course updated successfully", updat:course})
})

router.get('/courses', authenticateJwt, async (req, res)=>{
    const course = await Course.find();
    if(course){
        return res.status(200).json({message:"all courses", course})

    }
    res.status(404).json({message:"no courses found"})
})

router.get('/courses/:courseId', authenticateJwt, async (req, res)=>{
    const course = await Course.findById(req.params.courseId);
    if(course){
        return res.status(200).json({course})

    }
    res.status(404).json({message:"no courses found"})
})



export default router