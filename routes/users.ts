import jwt from 'jsonwebtoken';
import  express from 'express';
import {CreateUserRequestBody} from '../types/type'
import { User, Admin, Course } from '../db';
import { USER_SECRET, userAuthenticateJwt } from '../middleware';
const router = express.Router();


// - POST /users/signup
router.post('/signup', async (req,res)=>{
    let createUserRequestBody:CreateUserRequestBody = req.body;
    let user = await User.findOne({username:createUserRequestBody.username})
    if(user){
        return res.status(400).json({message:"user already exists pls login"})
    }
    let newUser = new User(createUserRequestBody);
    await newUser.save();
    let token = jwt.sign({id:newUser._id}, USER_SECRET,{expiresIn:'1h'})
    res.status(201).json({message:"user has successfully created", token})

})

// - POST /users/login
router.post('/login', async (req,res)=>{
    const{username, password} = req.headers
    let user = await User.findOne({username:username, password:password})
    if(user){
        let token = jwt.sign({id:user._id}, USER_SECRET, {expiresIn:'1h'})
        res.status(200).json({message:"user logged in successfully", token})
    }else{
        res.status(400).json({message:"user doesnt exists"})
    }
})

//get all courses
router.get('/courses', userAuthenticateJwt, async (req, res)=>{
    const allCourses = await Course.find({published:true})
    if(allCourses){
        return res.status(200).json({courses:allCourses})
    }
    res.status(404).json({message:"no courses found"})
})

//purchase a coures
router.post('/courses/:courseId', userAuthenticateJwt, async (req:any,res)=>{
    let user = await User.findOne({_id:req.userId})
    let course = await Course.findOne({_id:req.params.courseId, published:true})
    if(user && course){
        user?.purchasedCourses.push(req.params.courseId)
        await User.updateOne({_id:user._id},user)
        return res.status(200).json({message:"course purchased"})
    }
    res.status(404).json({message:"user doesnt exists"})
})

//get all courses for the given user
router.post('/purchasedCourses', userAuthenticateJwt, async (req:any, res:any)=>{
    let userId = req.userId;
    let user = await User.findOne({_id:userId})
    if(user){
        let purchasedCourses = user.purchasedCourses;
        console.log("get a;; ", purchasedCourses)
        
        let course = await Course.find({
            '_id': { $in: purchasedCourses }, published:true
        })
        return res.status(200).json(course)
    }

})

//get course by id
router.get('/courses/:courseId', userAuthenticateJwt, async (req:any,res)=>{
    let user = await User.findOne({_id:req.userId})
    let course = await Course.findOne({_id:req.params.courseId, published:true})
    if(user && course){
        return res.status(200).json({course})
    }
    res.status(404).json({message:"course doesnt exists"})
})

export default router