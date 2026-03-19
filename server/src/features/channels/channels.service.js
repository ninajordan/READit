import { getDatabase } from "../../config/db.js";

async function getNextChannelID() {
  const db = getDatabase();

  const lastChannel = await db
    .collection("channels")
    .find({})
    .sort({ channelID: -1 })
    .limit(1)
    .toArray();

  if (lastChannel.length === 0) {
    return "001";
  }

  const lastIdNumber = parseInt(lastChannel[0].channelID, 10);
  const incrementedId = lastIdNumber + 1;

  return incrementedId.toString().padStart(3, "0");
}

export async function getAllChannels(filters = {}) {
  try {
    const db = getDatabase();
    const query = {};

    if (filters.search && filters.search.trim() !== "") {
      query.$or = [
        { channelName: { $regex: filters.search, $options: "i" } },
        { channelDescription: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.category && filters.category.trim() !== "") {
      query.channelCategory = {
        $regex: `^${filters.category}$`,
        $options: "i",
      };
    }

    const channels = await db
      .collection("channels")
      .find(query)
      .sort({ channelID: 1 })
      .toArray();

    return channels;
  } catch (error) {
    console.log("CHANNELS SERVICE ERROR ", String(error));
    return [];
  }
}

export async function getHomepageChannels() {
  try {
    const db = getDatabase();

    const homepageChannels = await db
      .collection("channels")
      .find({ showOnHomepage: true })
      .sort({ channelID: 1 })
      .toArray();

    return homepageChannels;
  } catch (error) {
    console.log("CHANNELS SERVICE ERROR ", String(error));
    return [];
  }
}

export async function getChannelById(id) {
  try {
    const db = getDatabase();

    const channel = await db.collection("channels").findOne({ channelID: id });

    if (channel === null) {
      return { error: true, status: 404 };
    }

    return {
      channel: channel,
      error: false,
      status: 200,
    };
  } catch (error) {
    return { error: true, status: 500 };
  }
}

export async function getChannelWithPosts(id) {
  try {
    const db = getDatabase();

    const channel = await db.collection("channels").findOne({ channelID: id });

    if (channel === null) {
      return { error: true, status: 404 };
    }

    const posts = await db
      .collection("posts")
      .find({ channelID: id })
      .sort({ postID: -1 })
      .toArray();

    return {
      channel: channel,
      posts: posts,
      error: false,
      status: 200,
    };
  } catch (error) {
    return { error: true, status: 500 };
  }
}

export async function createChannelObject(
  channelName,
  channelDescription,
  channelCategory,
  bannerImage,
  showOnHomepage = false,
) {
  try {
    const db = getDatabase();
    const channelID = await getNextChannelID();

    if (!channelName || channelName.trim() === "") {
      return {
        error: true,
        status: 400,
        message: "Channel name is required",
      };
    }

    const existingChannel = await db
      .collection("channels")
      .findOne({ channelName: channelName });
    if (existingChannel !== null) {
      return {
        error: true,
        status: 409,
        message: "Channel already exists",
      };
    }

    const newChannel = {
      channelID: channelID,
      channelName: channelName,
      channelDescription: channelDescription ?? "",
      channelCategory: channelCategory ?? "",
      bannerImage: bannerImage,
      showOnHomepage: showOnHomepage,
    };

    await db.collection("channels").insertOne(newChannel);

    return {
      error: false,
      status: 201,
      channelData: newChannel,
      message: "Channel created",
    };
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: String(error),
    };
  }
}

export async function updateChannelObject(id, updates) {
  try {
    const db = getDatabase();

    const existingChannel = await db
      .collection("channels")
      .findOne({ channelID: id });
    if (existingChannel === null) {
      return {
        error: true,
        status: 404,
        message: "Channel not found",
      };
    }

    const updateData = {};

    if (updates.channelName !== undefined) {
      updateData.channelName = updates.channelName;
    }

    if (updates.channelDescription !== undefined) {
      updateData.channelDescription = updates.channelDescription;
    }

    if (updates.channelCategory !== undefined) {
      updateData.channelCategory = updates.channelCategory;
    }

    if (updates.showOnHomepage !== undefined) {
      updateData.showOnHomepage = updates.showOnHomepage;
    }

    await db
      .collection("channels")
      .updateOne({ channelID: id }, { $set: updateData });

    const updatedChannel = await db
      .collection("channels")
      .findOne({ channelID: id });

    return {
      error: false,
      status: 200,
      channelData: updatedChannel,
      message: "Channel updated",
    };
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: String(error),
    };
  }
}

export async function deleteChannelObject(id) {
  try {
    const db = getDatabase();

    const existingChannel = await db
      .collection("channels")
      .findOne({ channelID: id });
    if (existingChannel === null) {
      return {
        error: true,
        status: 404,
        message: "Channel not found",
      };
    }

    await db.collection("channels").deleteOne({ channelID: id });

    return {
      error: false,
      status: 200,
      message: "Channel deleted",
    };
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: String(error),
    };
  }
}
