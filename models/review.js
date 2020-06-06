var mongoose = require("mongoose");

// Schema setup
var reviewSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Film"
  },
  created: {type: Date, default: Date.now},
  rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);