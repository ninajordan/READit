import * as channelsService from "./channels.service.js";

export async function getAllChannels(req, res) {
  try {
    const { search, category } = req.query;

    const filters = {
      search: search?.trim() || "",
      category: category?.trim() || "",
    };

    const channels = await channelsService.getAllChannels(filters);

    if (channels.length === 0) {
      return res.status(200).json({
        channels: [],
        message: "No channels found",
      });
    }

    return res.status(200).json({
      channels: channels,
      message: "Channels found",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: String(error),
    });
  }
}

export async function getHomepageChannels(req, res) {
  try {
    const channels = await channelsService.getHomepageChannels();

    if (channels.length === 0) {
      return res.status(200).json({
        channels: [],
        message: "No homepage channels found",
      });
    }

    return res.status(200).json({
      channels: channels,
      message: "Homepage channels found",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: String(error),
    });
  }
}

export async function getChannelById(req, res) {
  try {
    const { id } = req.params;
    const channelData = await channelsService.getChannelById(id);

    if (channelData.error === true && channelData.status === 404) {
      return res.status(404).json({
        error: true,
        message: "Channel not found",
      });
    }

    return res.status(200).json({
      channelData: channelData,
      message: "Channel information found",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

export async function getChannelWithPosts(req, res) {
  try {
    const { id } = req.params;
    const channelData = await channelsService.getChannelWithPosts(id);

    if (channelData.error === true && channelData.status === 404) {
      return res.status(404).json({
        error: true,
        message: "Channel not found",
      });
    }

    return res.status(200).json({
      channelData: channelData,
      message: "Channel posts found",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

export async function createChannel(req, res) {
  try {
    const {
      channelName,
      channelDescription,
      channelCategory,
      bannerImage,
      Homepage,
    } = req.body;

    const channelCreated = await channelsService.createChannelObject(
      channelName,
      channelDescription,
      channelCategory,
      bannerImage,
      Homepage,
    );

    if (channelCreated.error === true) {
      return res.status(channelCreated.status).json({
        error: true,
        message: channelCreated.message,
      });
    }

    return res.status(201).json({
      error: false,
      message: "Channel created ",
      channel: channelCreated.channelData,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: String(error),
    });
  }
}

export async function updateChannel(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedChannel = await channelsService.updateChannelObject(
      id,
      updates,
    );

    if (updatedChannel.error === true) {
      return res.status(updatedChannel.status).json({
        error: true,
        message: updatedChannel.message,
      });
    }

    return res.status(200).json({
      error: false,
      message: "Channel updated",
      channel: updatedChannel.channelData,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: String(error),
    });
  }
}

export async function deleteChannel(req, res) {
  try {
    const { id } = req.params;

    const deletedChannel = await channelsService.deleteChannelObject(id);

    if (deletedChannel.error === true) {
      return res.status(deletedChannel.status).json({
        error: true,
        message: deletedChannel.message,
      });
    }

    return res.status(200).json({
      error: false,
      message: "Channel deleted",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: String(error),
    });
  }
}
