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

// mongoose.Promise = global.Promise;

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Product.paginate(query, options)
//         .then(result => {})
//         .catch(error => {});
// routes
app.use("/api/products", productRoute);

app.use("/api/llm", llmRoute);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); //allows requests from any origin (domain), which is useful for enabling access from other domains.
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //specifies which headers are allowed in incoming requests.
//   next();
// });

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});


mongoose
  .connect(
    "mongodb+srv://admin:123abc456@cluster0.zuaefuo.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
