import Video from "../models/videoModel.js";

// @desc Upload a new video
export const createVideo = async (req, res) => {
    try {
        const { title, description, url, thumbnail } = req.body;

        const video = new Video({
            title,
            description,
            url,
            thumbnail,
            channel: req.channel._id  // from middleware
        });

        await video.save();
        res.status(201).json({ message: "Video uploaded ✅", video });
    } catch (error) {
        res.status(500).json({ message: "Error uploading video", error: error.message });
    }
};

// @desc Get all videos (public)
export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .populate("channel", "name owner")
            .sort({ createdAt: -1 });

        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error: error.message });
    }
};

// @desc Get single video by ID (public)
export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate("channel", "name owner");
        if (!video) return res.status(404).json({ message: "Video not found" });
        // Increment views
        video.views += 1;
        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: "Error fetching video", error: error.message });
    }
};

// @desc Update video (only channel owner)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("channel");

    if (!video) return res.status(404).json({ message: "Video not found" });

    // check ownership
    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this video" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Video updated ✅", updatedVideo });
  } catch (error) {
    res.status(500).json({ message: "Error updating video", error: error.message });
  }
};

// @desc Delete video (only channel owner)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("channel");

    if (!video) return res.status(404).json({ message: "Video not found" });

    // check ownership
    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await video.deleteOne();
    res.json({ message: "Video deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error: error.message });
  }
};

// @desc Like a video
// @desc Like a video (with toggle)
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    // If already liked → remove (toggle off)
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter(id => id.toString() !== userId);
    } else {
      // Remove from dislikes if present
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
      video.likes.push(userId);
    }

    await video.save();
    res.json({
      message: "Like action completed ✅",
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error liking video", error: error.message });
  }
};

// @desc Dislike a video (with toggle)
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    // If already disliked → remove (toggle off)
    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
    } else {
      // Remove from likes if present
      video.likes = video.likes.filter(id => id.toString() !== userId);
      video.dislikes.push(userId);
    }

    await video.save();
    res.json({
      message: "Dislike action completed ✅",
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error disliking video", error: error.message });
  }
};

