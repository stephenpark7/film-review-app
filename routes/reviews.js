var express = require("express");
var router = express.Router({mergeParams: true});
var Film = require("../models/film.js");
var Review = require("../models/review.js");
var flash = require("connect-flash");
var middleware = require("../middleware");

// ================
// REVIEWS ROUTES
// ================

// Reviews New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Film.findById(req.params.id, function(err, film) {
    if (err) {
      req.flash("error", "Film was not found!");
      res.redirect("/films");
    }
    else {
      middleware.checkItemValid(req, res, film);
      res.render("reviews/new", {film: film});
    }
  });
});

// Reviews Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  Film.findById(req.params.id).populate("reviews").exec(function (err, foundFilm) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    middleware.checkItemValid(req, res, foundFilm);
    Review.create(req.body.review, function(err, review){
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      // add username and id to review
      review.author.id = req.user._id;
      review.author.username = req.user.username;
      review.film = foundFilm;
      // save review
      review.save();
      foundFilm.reviews.push(review);
      foundFilm.rating = calculateAverage(foundFilm.reviews);
      foundFilm.save();
      req.flash("success", "Your review has been successfully added.");
      res.redirect("/films/" + foundFilm._id);
    });
  });
  
});

// Reviews Edit
router.get("/:review_id/edit", middleware.checkReviewOwnership, function(req, res) {
  Review.findById(req.params.review_id, function(err, foundReview) {
    if (err) {
      req.flash("Review was not found!");
      res.redirect("back");
    }
    else {
      middleware.checkItemValid(req, res, foundReview);
      res.render("reviews/edit", {review: foundReview, film_id: req.params.id});
    }
  });
});

// Reviews Update
router.put("/:review_id", middleware.checkReviewOwnership, function(req, res) {
  Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function(err, updatedReview){
    if (err) {
      req.flash("Review was not found!");
      res.redirect("/films");
    }
    else {
      middleware.checkItemValid(req, res, updatedReview);
      Film.findById(req.params.id).populate("reviews").exec(function (err, foundFilm){
        if (err) {
          req.flash("error", err.message);
        }
        else {
          foundFilm.rating = calculateAverage(foundFilm.reviews);
          foundFilm.save();
          req.flash("success", "Saved changes made to review!");
          res.redirect("/films/" + req.params.id);
        }
      });
    }
  });
});

// Reviews Delete
router.delete("/:review_id", middleware.checkReviewOwnership, function(req, res) {
  Review.findByIdAndDelete(req.params.review_id, req.body.review, function (err, deletedReview) {
    if (err) {
      req.flash("error", "Review was not found!");
      res.redirect("/films");
    }
    else {
      Film.findById(deletedReview.film).populate("reviews").exec(function (err, foundFilm){
        if (err) {
          req.flash("error", err.message);
        }
        else {
          foundFilm.rating = calculateAverage(foundFilm.reviews);
          foundFilm.save();
          req.flash("success", "You have deleted your review!");
          res.redirect("/films/" + req.params.id);
        }
      });
    }
  });
});


function calculateAverage(reviews) {
  if (reviews.length === 0) {
    return 0;
  }
  var sum = 0;
  reviews.forEach(function (element) {
    sum += element.rating;
  });
  return sum / reviews.length;
}

module.exports = router;