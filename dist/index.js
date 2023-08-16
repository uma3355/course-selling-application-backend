"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3001;
//import authRoutes from './routes/auth';
const admin_1 = __importDefault(require("./routes/admin"));
const users_1 = __importDefault(require("./routes/users"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//navigate to authroute based on the route
app.use("/admin", admin_1.default);
app.use("/user", users_1.default);
app.listen(port, () => {
    console.log(`course-selling app listening at ${port}`);
});
mongoose_1.default.connect('mongodb+srv://kmahesh3355:uppEQN5QXVLonZgM@cluster0.qkxwjmm.mongodb.net/', { dbName: "course_sell_db" });
