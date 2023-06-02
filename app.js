require("dotenv").config();
const mailer = require('./utils/mailer')
require("express-async-errors");
const morgan = require('morgan')
const cookieSession = require('cookie-session');
const passport = require('passport');
// var GoogleStrategy = require('passsport-google-oidc');

const GoogleStrategy = require('passport-google-oauth20').Strategy;


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
//ADMIN
// const AdminJS = require('adminjs')
// const AdminJSExpress = require('@adminjs/express')
const connect = require('connect-pg-simple')
const session = require('express-session')
// const AdminJSmongoose = require('@adminjs/mongoose')
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


// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       callbackURL: '/oauth2/redirect/google',
//       passReqToCallback: true,
//       scope: ['profile', 'email'],
//     },
//     async function verify(req, accessToken, refreshToken, profile, done) {
//       console.error(req.authError);
//       try {
//         // Check if the user already exists in the database
//         const user = await User.findOne({ email: profile.emails[0].value });
//         // console.log(profile)
//         console.log("finding user")
//         console.log(user)
//         let newUser
//         if (user) {
//           newUser = user
//         }
//         if (!user) {
//           console.log("creating user " + profile.emails[0].value)
//           // Create a new user
//           newUser = await User.create(
//             {
//               name: profile.displayName,
//               email: profile.emails[0].value,
//               // user_id: newUser._id,
//               provider: profile.provider,
//               subject: profile.id,
//             }
//           );


//           return done(null, newUser);
//         }

//         // User already exists, fetch the user details
//         const existingUser = await User.findOne({ _id: newUser._id });
//         if (!existingUser) {
//           return done(null, false);
//         }

//         return done(null, existingUser);
//       } catch (error) {
//         console.log(error)
//         return done(error);
//       }
//     }
//   )
// );


// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// //Configure passport serialization and deserialization
// //serialize stores unique user info on the sessions (user._id)
// passport.serializeUser(function (user, done) {
//   done(null, user._id);
// });

// passport.deserializeUser(async function (id, done) {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });



// app.get('/testauth', () => {
//   console.log("test auth")
// });
// app.get('/testauth', () => {
//   console.log("test auth")
// });
// app.get('/testauth', () => {
//   console.log("fail auth")
// });
// //the route that starts the google auth process
// app.get('/login/federated/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get(
//   '/oauth2/redirect/google',
//   passport.authenticate('google', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//   })
// );
// app.get('/dashboard', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send('Welcome to the dashboard!');
//   } else {
//     res.send('/login');
//   }
// });
// app.get('/login', (req, res) => {
//   res.send('you have to login');
// });





app.use(morgan('dev'))
app.use(cookieParser())
// app.use(express.bodyParser({ limit: '50mb' }))
//auth middlewares
const auth = require("./middleware/authentication");
const adminAuthMiddleware = require("./middleware/admin-auth");

//routes
const MessageRoutes = require('./routes/messageR')
const ArticleRoutes = require('./routes/articleR')
const AdminPaymentRoutes = require('./routes/adminPayment')
const notificationRoutes = require('./routes/notificationRoute')
const withdrawalRoutes = require('./routes/withdrawalR')
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
  origin: ['https://mt-of-mercy.netlify.app', 'https://accounts.google.com', 'https://checkout.paystack.com', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
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
app.use("/message", adminAuthMiddleware, MessageRoutes);
app.use("/article", adminAuthMiddleware, ArticleRoutes);
app.use("/payment", adminAuthMiddleware, AdminPaymentRoutes);
// app.use("/withdrawal", auth, withdrawalRoutes);
// app.use("/upload", uploadRoutes);
app.use("/auth", auth, modifyUserRoutes);
// app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use("/admin/auth", adminAuth);
app.get('/', (req, res) => {
  res.json({ welcome: 'uacc mt of mercy' })
})

app.get('/authenticate/google', (req, res) => {
  console.log(res)
  res.json({ welcome: 'authenticated' })
})
// const { chargePayment, verifyPayment } = require('./controllers/payment')
// console.log(chargePayment, verifyPayment)
// app.post('/testpay', chargePayment)
// app.get('/paystack/callback', verifyPayment)

app.get('/')

app.use('/paystack', auth, paymentRoutes)
app.use('/verify', paymentRoutes)

app.get('/testuser', adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find({})
    const extractnames = users.map((user) => {
      return user.name
    })
    res.json({ names: extractnames })
  } catch (error) {
    console.log(error);
  }
})
app.use("/", adminAuthMiddleware, adminRoutes);

// const admin = new AdminJS({
//   databases: [mongoose],
//   // rootPath: '/secret',
//   dashboard: {
//     component: null
//   },
//   resources: [{
//     resource: UserSchema,
//     options: {
//       //     listProperties: ['', 'name', 'createdAt'],
//       //     filterProperties: ['id', 'name', 'createdAt'],
//       //     editProperties: ['id', 'name', 'bio', 'createdAt'],
//       listProperties: ['name', 'address', 'zipCode', 'countryOfResidence', 'seedPhrase'],
//     },
//   }],
// })



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
const DEFAULT_ADMIN = {
  email: 'lorraine@gmail.com',
  password: 'lorraine'
}
// const adminRouter = AdminJSExpress.buildRouter(admin)
// app.use(admin.options.rootPath, adminRouter)
app.use(notFoundMiddleware);