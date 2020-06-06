var Film = require("../models/film");
var Review = require("../models/review");

// All the middleware goes here

var middlewareObj = {};

middlewareObj.checkFilmOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Film.findById(req.params.id, function(err, foundFilm) {
      if (err) {
        req.flash("Film was not found!");
        res.redirect("back");
      }
      else {
        if (!foundFilm) {
          req.flash("error", "Film was not found!");
          return res.redirect("back");
        }
        if (foundFilm.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You need to be logged in!");
    res.redirect("/login");
  }
}

middlewareObj.checkReviewOwnership = function checkReviewOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, function(err, foundReview) {
      if (err) {
        req.flash("Review was not found!");
        res.redirect("back");
      }
      else {
        if (!foundReview) {
          req.flash("error", "Review was not found!");
          return res.redirect("back");
        }
        if (foundReview.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You need to be logged in!");
    res.redirect("/login");
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in!");
  res.redirect("/login");
}

middlewareObj.getClientIP = function(req){
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

middlewareObj.checkItemValid = function(req, res, item) {
  if (!item) {
    req.flash("error", "Item was not found!");
    return res.redirect("back");
  }
}

module.exports = middlewareObj;