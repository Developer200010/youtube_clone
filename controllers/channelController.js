import Channel from "../models/channelModel.js";

//creating a channel
export const createChannel = async (req, res) => {
  try {
    const { name, description, banner } = req.body;

    // check if channel already exists
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) return res.status(400).json({ message: "Channel name already taken" });

    const channel = new Channel({
      name,
      description,
      banner,
      owner: req.user.id
    });

    await channel.save();
    res.status(201).json({ message: "Channel created ✅", channel });
  } catch (error) {
    res.status(500).json({ message: "Error creating channel", error: error.message });
  }
};

// @desc Get all channels
export const getChannels = async (req, res) => {
  try {
    console.log("it hit")
    const channels = await Channel.find().populate("owner", "username email");
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching channels", error: error.message });
  }
};

// @desc Get single channel by ID
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("owner", "username email");
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching channel", error: error.message });
  }
};

// @desc Update channel (only owner can update)
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Channel updated ✅", updatedChannel });
  } catch (error) {
    res.status(500).json({ message: "Error updating channel", error: error.message });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await channel.deleteOne();
    res.json({ message: "Channel deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting channel", error: error.message });
  }
};