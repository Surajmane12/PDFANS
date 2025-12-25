import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import express from "express"
import { Router } from 'express'

const uploadRouter = express.Router();

const upload = multer({ dest: "uploads/" });

uploadRouter.post("/", upload.single("file"), async (req, res) => {
    try {
        console.log(req.file.path)
        if (!req.file.path) {
            return res.status(400).json({ message: "No file found" })
        }
        const filePath = req.file.path;

        const formData = new FormData();
        formData.append(
            "file",
            fs.createReadStream(filePath),
            req.file.originalname
        );

        // forward file to Python LLM service
        const response = await axios.post("http://localhost:8001/upload", formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data)
        return res.json(response.data)
    }
    catch (error) {
        console.log("Error while uploading the file: ", error)
        return res.status(500).json({ error: "File upload failed" })

    }

})

export default uploadRouter;