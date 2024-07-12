import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
)

app.use(cookieParser())
app.use(express.json({limit: "16kb"}))
app.use(urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("App is connected")
})

const port = process.env.PORT || 3000


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})


export { app }
