require("dotenv").config();
const { validateEnv } = require("./config/env");
require("express-async-errors");
const morgan = require("morgan");
const passport = require("passport");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const session = require("express-session");
const { webhookVerification } = require("./controllers/payment");

const authorRoutes = require("./routes/author.js");
const MessageRoutes = require("./routes/messageR");
const ArticleRoutes = require("./routes/articleR");
const AdminPaymentRoutes = require("./routes/adminPayment");
const authRoutes = require("./routes/authRoute");
const adminAuthRoutes = require("./routes/adminAuth");
const modifyUserRoutes = require("./routes/modifyUserR");
const adminRoutes = require("./routes/adminRoute");
const clientRoutes = require("./routes/clientRoute");
const clientArticleRoutes = require("./routes/clientArticleRoute");
const paymentRoutes = require("./routes/payment");
const googleAuthRoutes = require("./routes/googleAuth");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const connectDB = require("./db/connect");

validateEnv();

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 150,
  })
);
app.use(helmet());
app.use(
  cors({
    origin: [
      "https://mt-of-mercy.netlify.app",
      "https://accounts.google.com",
      "https://checkout.paystack.com",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(xss());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.static("./public"));

app.post(
  "/paystack/webhook",
  express.raw({ type: "application/json" }),
  webhookVerification
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/", googleAuthRoutes);
app.use("/auth", authRoutes);
app.use("/auth", modifyUserRoutes);
app.use("/author", authorRoutes);
app.use("/messages", clientRoutes);
app.use("/articles", clientArticleRoutes);
app.use("/message", MessageRoutes);
app.use("/article", ArticleRoutes);
app.use("/admin/payments", AdminPaymentRoutes);
app.use("/admin/auth", adminAuthRoutes);
app.use("/paystack", paymentRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ welcome: "uacc mt of mercy" });
});

app.get("/privacy-policy", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/#/privacy-policy`);
});

app.get("/terms-of-service", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/#/terms-of-service`);
});

app.use(notFoundMiddleware);
app.use(errorHandler);

const port = process.env.PORT || 4000;
const cloud = process.env.CLOUD_URI;

const start = async () => {
  try {
    await connectDB(cloud);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

module.exports = app;
