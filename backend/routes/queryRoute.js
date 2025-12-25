import axios from 'axios'
import { Router } from 'express'
import express from "express"
const queryRouter = express.Router();

queryRouter.post("/",async(req,res)=>{
    try {
        const {question} = req.body;
        console.log("question got: ",question)

        const response = await axios.post("http://localhost:8001/query",{question})
       
        console.log(response.data)

        return res.json(response.data)
    } 
    catch (error) {
        console.log("Error while uploading the file: ",error)
       return res.status(500).json({ error: "Error while sending query" })
    }
   
})

export default queryRouter;