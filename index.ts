import express from 'express'
import mongoose  from "mongoose";
import cors from 'cors'

const app = express();
const port = 3001;
//import authRoutes from './routes/auth';
import adminRoutes from './routes/admin'
import userRoutes from './routes/users'

app.use(cors());

app.use(express.json());
//navigate to authroute based on the route
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.listen(port, ()=> {
    console.log(`course-selling app listening at ${port}`)
})

mongoose.connect('mongodb+srv://kmahesh3355:uppEQN5QXVLonZgM@cluster0.qkxwjmm.mongodb.net/', { dbName: "course_sell_db" });





