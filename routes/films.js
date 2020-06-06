var express = require("express");
var router = express.Router();
var Film = require("../models/film");
var middleware = require("../middleware");

// FILMS route
router.get("/", function(req, res){
  // Get all films from DB
  Film.find({}, function(err, films){
    if (err) {
      res.send(err);
    }
    else {
      res.render("films/index", {films: films});
    }
  });
});

// NEW - show form to create new film
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("films/new");
});

// CREATE - add new film to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  var newFilm = {
    name: req.body.film.name,
    image: req.body.film.image,
    description: req.body.film.description,
    genre: req.body.film.genre
  }
  var username = req.user.username;
  Film.create({
    name: newFilm.name,
    image: newFilm.image,
    description: newFilm.description,
    genre: newFilm.genre,
    author: {
      id: req.user._id,
      username: username
    }
  }, function(err, film) {
    if (err) {
      req.flash("error", "Can't create a new film at this time, please contact the site administrator for more information.");
      res.redirect("/films");
    }
    else {
      req.flash("success", "You have successfully added a new film!");
      res.redirect("/films");
    }
  })
});

// SHOW - shows more info about one film
router.get("/:id", function(req, res){
  Film.findById(req.params.id).populate("reviews").exec(function(err, foundFilm){
    if (err) {
      req.flash("error", "Could not find film with id: \"" + req.params.id + "\"");
      res.redirect("/films");
    }
    else {
      middleware.checkItemValid(req, res, foundFilm);
      res.render("films/show", {film: foundFilm});
    }
  });
});

// EDIT - film route, show form
router.get("/:id/edit", middleware.checkFilmOwnership, function(req, res) {
  Film.findById(req.params.id, function(err, foundFilm) {
    if (err) {
      req.flash("error", "Film was not found!");
      res.redirect("/films");
    }
    else {
      middleware.checkItemValid(req, res, foundFilm);
      res.render("films/edit", {film: foundFilm});
    }
  });
});

// UPDATE - film route
router.put("/:id", middleware.checkFilmOwnership, function(req, res) {
  Film.findByIdAndUpdate(req.params.id, req.body.film, function(err, updatedFilm){
    if (err) {
      req.flash("error", "Film was not found!");
      res.redirect("/films");
    }
    else {
      middleware.checkItemValid(req, res, updatedFilm);
      req.flash("success", "Saved changes made!");
      res.redirect("/films/" + req.params.id);
    }
  });
});

// DESTROY - film route
router.delete("/:id", middleware.checkFilmOwnership, function(req, res) {
  Film.findByIdAndDelete(req.params.id, req.body.film, function (err, deletedFilm) {
    if (err) {
      req.flash("error", "Film was not found!");
      res.redirect("/films");
    }
    else {
      req.flash("success", "You have successfully deleted a film!");
      res.redirect("/films");
    }
  });
});

module.exports = router;