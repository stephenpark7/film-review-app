const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

const Film = require("./models/film"),
      Review = require("./models/review"),
      User = require("./models/user");

const SERVER_PORT = process.env.PORT || 8080;

require("dotenv").config();

// Requiring routes
var reviewRoutes = require("./routes/reviews"),
    filmRoutes = require("./routes/films"),
    indexRoutes  = require("./routes/index")

mongoose.connect(process.env.DATABASEURL, {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set("useFindAndModify", false);

app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT configuration
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
app.use(session({
  secret: "ThisIsTheBestPasswordEver",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH config
app.use(flash());

// momentJS
app.locals.moment = require("moment");

// currentUser config
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Route config
app.use("/", indexRoutes);
app.use("/films", filmRoutes);
app.use("/films/:id/reviews", reviewRoutes);

// Start server
app.listen(SERVER_PORT, function(){
  console.log("Server started at port: " + SERVER_PORT);
});