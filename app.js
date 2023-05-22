require("dotenv").config();
const mailer = require('./utils/mailer')
require("express-async-errors");
const morgan = require('morgan')
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
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
// const { useTranslation, ComponentLoader } = require('adminjs')

// const componentLoader = new ComponentLoader()

// const Components = {
//   Dashboard: componentLoader.add('Dashboard', './dashboard'),
// }
// ComponentLoader.override()



// AdminJS.registerAdapter({
//   Resource: AdminJSmongoose.Resource,
//   Database: AdminJSmongoose.Database,
// })


app.use(morgan('dev'))
// app.use(express.bodyParser({ limit: '50mb' }))
//auth middlewares
const auth = require("./middleware/authentication");
const adminAuthMiddleware = require("./middleware/admin-auth");

//routes
const MessageRoutes = require('./routes/messageR')
const ArticleRoutes = require('./routes/articleR')
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
  origin: ['https://variant-d.netlify.app', 'https://binary-options-admin.vercel.app', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000']
}));
app.use(xss());

app.get("/test-upload-ruby", (req, res) => {
  res.render('index');
});

// routes
app.use("/auth", authRoutes);
app.use("/messages", clientRoutes);

app.use("/articles", clientArticleRoutes);
// app.use("/messages", clientRoutes);
// app.use("/notification", adminAuth, notificationRoutes);
app.use("/message", adminAuthMiddleware, MessageRoutes);
app.use("/article", adminAuthMiddleware, ArticleRoutes);
// app.use("/withdrawal", auth, withdrawalRoutes);
// app.use("/upload", uploadRoutes);
app.use("/auth", auth, modifyUserRoutes);
// app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use("/admin/auth", adminAuth);
app.get('/', (req, res) => {
  res.json({ welcome: 'binary options' })
})

// const { chargePayment, verifyPayment } = require('./controllers/payment')
// console.log(chargePayment, verifyPayment)
// app.post('/testpay', chargePayment)
// app.get('/paystack/callback', verifyPayment)

app.use('/paystack', paymentRoutes)

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
    await connectDB(local);
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