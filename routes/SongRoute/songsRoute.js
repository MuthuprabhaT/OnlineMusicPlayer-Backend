const express = require("express");
const router = express.Router();
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");
const Song = require("../../models/songModel");
const User = require("../../models/userModel");
const authMiddleware = require("../../middlewares/authMiddleware");

router.post(
  "/add-new-song",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Files:", req.file);
    try {
      const audiourl = req.files["audio"][0].path;
      const imageurl = req.files["image"][0].path;

      console.log("ImageUrl:", imageurl);
      console.log("AudioUrl:", audiourl);

      const audioResult = await cloudinary.uploader.upload(audiourl, {
        resource_type: "auto",
        folder: "Beat-Flow",
      });

      const imageResult = await cloudinary.uploader.upload(imageurl, {
        resource_type: "auto",
        folder: "Beat-Flow",
      });

      let song = new Song({
        title: req.body.title,
        artist: req.body.artist,
        songUrl: audioResult.secure_url,
        imageUrl: imageResult.secure_url,
        duration: req.body.duration,
      });

      await song.save();
      res.json(song);
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/get-all-songs", async (req, res) => {
  try {
    const songs = await Song.find({});
    res.status(200).send({
      message: "Songs Fetched Successfully",
      success: true,
      data: songs,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error Fetching songs",
      success: false,
      data: error,
    });
  }
});

router.get("/get-playlists", async (req, res) => {
  try {
    const playlists = await User.find({});
    res.status(200).send({
      message: "Playlists Fetched Successfully",
      success: true,
      data: playlists,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error Fetching songs",
      success: false,
      data: error,
    });
  }
});

router.post("/create-playlist", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    const existingPlaylists = user.playlists;

    existingPlaylists.push({
      name: req.body.playlistName,
      songs: req.body.songs,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );
    res.status(200).send({
      message: "Playlist created successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating playlist",
      success: false,
      data: error,
    });
  }
});

router.post("/delete-playlist", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    let existingPlaylists = user.playlists;
    existingPlaylists = existingPlaylists.filter((playlist) => {
      if (playlist.name === req.body.name) {
        return false;
      }
      return true;
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Playlist deleted successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting playlist",
      success: true,
      data: error,
    });
  }
});

router.post("/update-playlist", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    let existingPlaylists = user.playlists;
    existingPlaylists = existingPlaylists.map((playlist) => {
      if (playlist.name === req.body.playlistName) {
        playlist.songs = req.body.songs;
      }
      return playlist;
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Playlist updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error updating playlist",
      success: false,
      data: error,
    });
  }
});

module.exports = router;
