require('dotenv').config();
const express  = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(cors());


mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(()=> console.log("MongoDB Error", err));

app.get("/", (req, res)=> {
  res.send("Cakend is running...");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));