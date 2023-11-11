const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const createError = require('http-errors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();
const port = 4000 || process.env.PORT;


const app = express();


// Middleware
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(flash());

// Parsing JSON and URL-encoded body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Views engine setup
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

// Initialize Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Passport JS Authentication setup
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

// Set the user object to be available in templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Define routes
app.use('/', require('./routes/indexRoutes'));
app.use('/user',require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoute'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/petugas', require('./routes/petugasRoutes'));


// 404 Handler for unhandled routes
app.use((req, res, next) => {
  next(createError.NotFound());
});

// Error handler middleware
app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  console.error(error);
  res.send(error);
});

// Database connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));