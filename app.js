require("dotenv").config();
const mailer = require('./utils/mailer')
require("express-async-errors");
const morgan = require('morgan')
const cookieSession = require('cookie-session');
const passport = require('passport');
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
// const swaggerUI = require('swagger-ui-express');
const docs = require('./docs');
const ejs = require('ejs')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
const mongoose = require('mongoose')
const connect = require('connect-pg-simple')
const session = require('express-session')
const UserSchema = require('./models/UserModel')
const Dashboard = require('./dashboard.js')
const User = require('./models/UserModel')

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'))
app.use(cookieParser())
// app.use(express.bodyParser({ limit: '50mb' }))
//auth middlewares
// const auth = require("./middleware/authentication");
// const adminAuthMiddleware = require("./middleware/admin-auth");

//routes
const MessageRoutes = require('./routes/messageR')
const ArticleRoutes = require('./routes/articleR')
const AdminPaymentRoutes = require('./routes/adminPayment')
const authRoutes = require("./routes/authRoute");
const adminAuth = require("./routes/adminAuth");
const uploadRoutes = require("./routes/uploadIdR")
const modifyUserRoutes = require('./routes/modifyUserR')
const adminRoutes = require('./routes/adminRoute')
const clientRoutes = require('./routes/clientRoute')
const clientArticleRoutes = require('./routes/clientArticleRoute')
const paymentRoutes = require('./routes/payment')
const paymentVerifyRoutes = require('./routes/paymentVerify')
const googleAuthRoutes = require('./routes/googleAuth')
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const connectDB = require("./db/connect");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
// extra security packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: [
    'https://mt-of-mercy.netlify.app', 
    'https://accounts.google.com', 
    'https://checkout.paystack.com', 
    'http://localhost:5173', 
    'http://localhost:5174',  
    'http://localhost:3000'],
  credentials: true
}));
app.use(xss());

app.get("/test-upload-ruby", (req, res) => {
  res.render('index');
});
app.use('/', googleAuthRoutes)
// routes
app.use("/auth", authRoutes);
app.use("/messages", clientRoutes);

app.use("/articles", clientArticleRoutes);
// app.use("/messages", clientRoutes);
// app.use("/notification", adminAuth, notificationRoutes);
app.use("/message",  MessageRoutes);
app.use("/article",  ArticleRoutes);
app.use("/admin/payments",  AdminPaymentRoutes);
// app.use("/withdrawal", auth, withdrawalRoutes);
// app.use("/upload", uploadRoutes);
app.use("/auth", modifyUserRoutes);

// app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use("/admin/auth", adminAuth);
app.get('/', (req, res) => {
  res.json({ welcome: 'uacc mt of mercy' })
})

app.get('/authenticate/google', (req, res) => {
  console.log(res)
  res.json({ welcome: 'authenticated' })
})

app.get('/delete-data', (req, res) => {
  res.json({ message: "Deleted data" })
})
app.get('/privacy-policy', (req, res) => {
  res.json({ message: "Privacy policy" })
})
app.get('/terms-of-service', (req, res) => {
  res.json({ message: "Deleted data" })
})

app.use('/paystack', paymentRoutes)
app.use('/verify', paymentRoutes)

app.use("/admin", adminRoutes);


app.use(notFoundMiddleware);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});



const port = process.env.PORT || 4000;
//switch between local and cloud db

const local = process.env.LOCAL_URI;
const cloud = process.env.CLOUD_URI;

const start = async () => {
  try {
    await connectDB(cloud);
    // admin.watch()
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
