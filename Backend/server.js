require('dotenv').config();
const express  = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/ProductRoutes")
const adminRoutes = require('./routes/AdminRoutes')
const adminInventoryRoutes = require('./routes/AdminInventory');
const userRoutes = require('./routes/UserRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');
const orderRoutes = require('./routes/OrderRoutes');

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes)
app.use("/api/admin", adminRoutes)
app.use('/api/admin/inventory', adminInventoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/orders', orderRoutes)



mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(()=> console.log("MongoDB Error", err));

app.get("/", (req, res)=> {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));