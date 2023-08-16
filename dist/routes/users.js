"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
// - POST /users/signup
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let createUserRequestBody = req.body;
    let user = yield db_1.User.findOne({ username: createUserRequestBody.username });
    if (user) {
        return res.status(400).json({ message: "user already exists pls login" });
    }
    let newUser = new db_1.User(createUserRequestBody);
    yield newUser.save();
    let token = jsonwebtoken_1.default.sign({ id: newUser._id }, middleware_1.USER_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: "user has successfully created", token });
}));
// - POST /users/login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    let user = yield db_1.User.findOne({ username: username, password: password });
    if (user) {
        let token = jsonwebtoken_1.default.sign({ id: user._id }, middleware_1.USER_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "user logged in successfully", token });
    }
    else {
        res.status(400).json({ message: "user doesnt exists" });
    }
}));
//get all courses
router.get('/courses', middleware_1.userAuthenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allCourses = yield db_1.Course.find({ published: true });
    if (allCourses) {
        return res.status(200).json({ courses: allCourses });
    }
    res.status(404).json({ message: "no courses found" });
}));
//purchase a coures
router.post('/courses/:courseId', middleware_1.userAuthenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield db_1.User.findOne({ _id: req.userId });
    let course = yield db_1.Course.findOne({ _id: req.params.courseId, published: true });
    if (user && course) {
        user === null || user === void 0 ? void 0 : user.purchasedCourses.push(req.params.courseId);
        yield db_1.User.updateOne({ _id: user._id }, user);
        return res.status(200).json({ message: "course purchased" });
    }
    res.status(404).json({ message: "user doesnt exists" });
}));
//get all courses for the given user
router.post('/purchasedCourses', middleware_1.userAuthenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.userId;
    let user = yield db_1.User.findOne({ _id: userId });
    if (user) {
        let purchasedCourses = user.purchasedCourses;
        console.log("get a;; ", purchasedCourses);
        let course = yield db_1.Course.find({
            '_id': { $in: purchasedCourses }, published: true
        });
        return res.status(200).json(course);
    }
}));
//get course by id
router.get('/courses/:courseId', middleware_1.userAuthenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield db_1.User.findOne({ _id: req.userId });
    let course = yield db_1.Course.findOne({ _id: req.params.courseId, published: true });
    if (user && course) {
        return res.status(200).json({ course });
    }
    res.status(404).json({ message: "course doesnt exists" });
}));
exports.default = router;
