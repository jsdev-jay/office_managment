import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
  res.send("Jay Patel is here!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
