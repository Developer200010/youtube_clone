import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("db is connected successfully"))
.catch((err)=> console.log(err.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server is running on port${PORT}`)
})