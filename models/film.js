var mongoose = require("mongoose");

// Schema setup
var filmSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  created: {type: Date, default: Date.now},
  genre: String,
  rating: {type: Number, default: 0},
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }  
  ]
});

module.exports = mongoose.model("Film", filmSchema);