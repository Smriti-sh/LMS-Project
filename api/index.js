const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const llmRoute = require("./routes/llm.route.js");
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// app.post('/api/products/', upload.single('pdfFile'), (req, res) => {
//   console.log(req.file); // File information
//   console.log(req.body); // Other form data

//   res.send({ message: 'File uploaded successfully' });
// });

// app.listen(3001, () => {
//   console.log('Server is running on http://localhost:3001');
// });


// routes
app.use("/api/products", productRoute);

app.use("/api/llm", llmRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});


mongoose
  .connect(
    "mongodb+srv://admin:123abc456@cluster0.zuaefuo.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
