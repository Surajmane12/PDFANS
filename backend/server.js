import express from 'express'
import cors from 'cors'
import uploadRouter from './routes/uploadRoutes.js'
import queryRouter from './routes/queryRoute.js'
const app = express();


app.use(cors());
app.use(express.json())

app.use('/api/upload',uploadRouter)
app.use('/api/query',queryRouter)


app.listen(5000,()=>console.log("server is runing on port 5000"))
