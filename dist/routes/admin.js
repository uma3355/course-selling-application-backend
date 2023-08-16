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
const generateJwt = (userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, middleware_1.SECRET, { expiresIn: '1h' });
    return token;
};
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(401).json({ message: "username and password are mandatory" });
    }
    const { username, password } = req.body;
    console.log("username admin 1", username);
    const user = yield db_1.User.findOne({ username });
    console.log(typeof user);
    if (user) {
        res.status(400).json({ message: "user already exist pls log in" });
    }
    else {
        const newUser = new db_1.User({
            username, password
        });
        yield newUser.save();
        console.log("newUser admin 1", newUser);
        //generate token
        const token = generateJwt(newUser._id);
        res.status(200).json({ message: 'Token has successfully generated', token: token });
    }
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    //check for user exists or not
    const user = yield db_1.User.findOne({ username, password });
    if (!user) {
        res.status(400).json({ message: `this ${username} doesnt exists ` });
    }
    else {
        const token = generateJwt(user._id);
        res.status(200).json({ message: `logged in successfully`, token: token });
    }
}));
//add course
router.post('/courses', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let course = req.body;
    console.log("courses create courese api", course);
    if (!course) {
        console.log("culprit");
        res.status(400).json({ message: "request body is required" });
    }
    else {
        const newCourse = new db_1.Course(course);
        yield newCourse.save();
        console.log("newCourse create courese api", newCourse);
        res.status(201).json({ message: "course has successfully created", courseId: newCourse._id });
    }
}));
router.put('/courses/:courseId', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updateCourese = req.body;
    console.log("update courses put", updateCourese);
    let courese = yield db_1.Course.findOne({ _id: req.params.courseId });
    if (!courese) {
        return res.status(404).json({ message: "course doesnt exists" });
    }
    console.log("courese courses put", courese);
    yield db_1.Course.findByIdAndUpdate({ _id: req.params.courseId }, updateCourese);
    let course = yield db_1.Course.findOne({ _id: req.params.courseId });
    console.log("course after courses put", course);
    console.log("updated course", course);
    res.status(200).json({ message: "course updated successfully", updat: course });
}));
router.get('/courses', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield db_1.Course.find();
    if (course) {
        return res.status(200).json({ message: "all courses", course });
    }
    res.status(404).json({ message: "no courses found" });
}));
router.get('/courses/:courseId', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield db_1.Course.findById(req.params.courseId);
    if (course) {
        return res.status(200).json({ course });
    }
    res.status(404).json({ message: "no courses found" });
}));
exports.default = router;
