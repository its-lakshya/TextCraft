import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/index.js"

dotenv.config({
  path: "./env"
})

connectDB()
.then(() => {
  app.on("ERROR", (error) => {
    console.log("Error: ", error)
    throw error
  })
})
.catch((error) => {
  console.log("MONGOE_DB connection failed !!!", error)
})