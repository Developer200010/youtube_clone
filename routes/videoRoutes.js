import express from "express";
import {
    createVideo, getVideos, getVideoById, updateVideo,
    deleteVideo, likeVideo,
    dislikeVideo
} from "../controllers/videoController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isChannelOwner } from "../middlewares/ownerShipMiddlerWare.js";

const router = express.Router();

// Create video (only channel owner)
router.post("/:channelId", protect, isChannelOwner, createVideo);

// Get all videos (public)
router.get("/", getVideos);

// Get single video (public)
router.get("/:id", getVideoById);

// Update video (only channel owner)
router.put("/:id", protect, updateVideo);

// Delete video (only channel owner)
router.delete("/:id", protect, deleteVideo);

// Like & Dislike routes (protected)
router.post("/:id/like", protect, likeVideo);
router.post("/:id/dislike", protect, dislikeVideo);

export default router;
