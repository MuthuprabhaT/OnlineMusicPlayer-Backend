const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    songUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("songs", songSchema);
