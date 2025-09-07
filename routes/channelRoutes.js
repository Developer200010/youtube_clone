import express from "express";
import {
  createChannel,
  getChannels,
  getChannelById,
  updateChannel,
  deleteChannel
} from "../controllers/channelController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getChannels);
router.get("/:id", getChannelById);

// Protected routes
router.post("/", protect, createChannel);
router.put("/:id", protect, updateChannel);
router.delete("/:id", protect, deleteChannel);

export default router;
