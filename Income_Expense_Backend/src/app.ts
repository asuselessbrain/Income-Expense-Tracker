import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./routes/routes";
import { globalErrorHandler } from "./app/errors/globalErrorHandler";
import notFound from "./app/middlewares/notFount";

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response)=>{
    res.send({"message": "Server is running!"})
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;