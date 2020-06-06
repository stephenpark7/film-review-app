var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    flash = require("connect-flash"),
    middleware = require("../middleware");

// Index - Show all films
router.get("/", function(req, res){
  res.render("landing");
});

/*

    AUTH routes
    
*/

// Show register form
router.get("/register", function(req, res) {
  res.render("register");
});

// Handle sign-up logic
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to FilmCritic!");
      res.redirect("/films");
    });
  });
});

// Show login form
router.get("/login", function(req, res) {
  res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/films",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password.",
    successFlash: "You have successfully logged in!"
  }), function(req, res) {
});

// Handle logout logic
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "You have succesfully logged out!");
   res.redirect("/films");
});

module.exports = router;