const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route');
const llmRoute = require('./routes/llm.route');
const authRoute = require('./routes/user.route'); // Add this line
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const verifyToken = require('./utils/auth'); // Import the middleware

// mongoose.Promise = global.Promise;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); //allows requests from any origin (domain), which is useful for enabling access from other domains.
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //specifies which headers are allowed in incoming requests.
//   next();
// });

const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 10 minutes
  max: 50, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes',
});

// Routes
// Add middleware for auth - verifyToken
app.use('/api/products', rateLimiter, verifyToken, productRoute);
app.use('/api/llm', rateLimiter, verifyToken, llmRoute);
app.use('/api/user', rateLimiter, authRoute);

app.get('/', rateLimiter, (req, res) => {
  res.send('Hello from Node API Server Updated');
});

mongoose
  .connect(
    'mongodb+srv://admin:123abc456@cluster0.zuaefuo.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(() => {
    console.log('Connection failed!');
  });
