import { getDatabase } from "../../config/db.js";

async function getNextPostID() {
  const db = getDatabase();
  const lastPost = await db
    .collection("posts")
    .find({})
    .sort({ postID: -1 })
    .limit(1)
    .toArray();

  if (lastPost.length === 0) {
    return "001";
  }

  const lastIdNumber = parseInt(lastPost[0].postID, 10);
  const incrementedId = lastIdNumber + 1;

  return incrementedId.toString().padStart(3, "0");
}

function createPreview(text) {
  if (text.length > 120) {
    const preview = text.slice(0, 120);
    return `${preview}...`;
  } else {
    return text;
  }
}

export async function listAllPosts(limit = 20, start = 0) {
  try {
    const db = getDatabase();

    const allPosts = await db
      .collection("posts")
      .find({})
      .sort({ postID: -1 })
      .toArray();

    if (start > allPosts.length) {
      start = 0;
    }
    const end = Math.min(start + limit, allPosts.length);
    const postsToSend = allPosts.slice(start, end);

    const userIDs = postsToSend.map((p) => p.posterID);

    const users = await db
      .collection("users")
      .find({ userID: { $in: userIDs } })
      .toArray();
    const userMap = {};
    for (const user of users) {
      userMap[user.userID] = user.user_anonymity;
    }

    for (let i = 0; i < postsToSend.length; i++) {
      const postBody = postsToSend[i].postBody;
      const preview = createPreview(postBody);
      postsToSend[i]["preview"] = preview;
      postsToSend[i]["posterName"] = userMap[postsToSend[i]["posterID"]];
    }

    const response = {
      metadata: {
        total: allPosts.length,
        start: start,
        end: end,
        limit: limit,
      },
      posts: postsToSend,
    };

    return response;
  } catch (error) {
    console.log("[POSTS SERVICE ERROR] Ran into Error: ", String(error));
    return {
      metadata: {},
      posts: [],
    };
  }
}

export async function listChannelPosts(channelID, limit = 20, start = 0) {
  try {
    const db = getDatabase();

    const channel = await db
      .collection("channels")
      .findOne({ channelID: channelID });
    if (channel === null) {
      return {
        metadata: {},
        posts: [],
      };
    }
    const allPosts = await db
      .collection("posts")
      .find({ channelID: channelID })
      .sort({ postID: -1 })
      .toArray();

    if (start > allPosts.length) {
      start = 0;
    }
    const end = Math.min(start + limit, allPosts.length);
    const postsToSend = allPosts.slice(start, end);

    const userIDs = postsToSend.map((p) => p.posterID);

    const users = await db
      .collection("users")
      .find({ userID: { $in: userIDs } })
      .toArray();
    const userMap = {};
    for (const user of users) {
      userMap[user.userID] = user.user_anonymity;
    }

    for (let i = 0; i < postsToSend.length; i++) {
      const postBody = postsToSend[i].postBody;
      const preview = createPreview(postBody);
      postsToSend[i]["preview"] = preview;
      postsToSend[i]["posterName"] = userMap[postsToSend[i]["posterID"]];
    }

    const response = {
      metadata: {
        total: allPosts.length,
        start: start,
        end: end,
        limit: limit,
      },
      posts: postsToSend,
    };

    return response;
  } catch (error) {
    console.log("[POSTS SERVICE ERROR] Ran into Error: ", String(error));
    return {
      metadata: {},
      posts: [],
    };
  }
}

export async function getPostById(id) {
  try {
    const db = getDatabase();

    const post = await db.collection("posts").findOne({ postID: id });
    if (post === null) {
      return { error: true, status: 404 };
    }

    const posterID = post.posterID;
    const user = await db.collection("users").findOne({ userID: posterID });
    const posterName = user.anonymity;
    post.posterName = posterName;
    const comments = await db
      .collection("comments")
      .find({ postID: id })
      .toArray();

    const userIDs = comments.map((c) => c.userID);

    const users = await db
      .collection("users")
      .find({ userID: { $in: userIDs } })
      .toArray();
    const userMap = {};
    for (const user of users) {
      userMap[user.userID] = user.user_anonymity;
    }

    for (let i = 0; i < comments.length; i++) {
      comments[i].posterName = userMap[comments[i].userID];
    }

    const postData = {
      post: post,
      comments: comments,
      status: 200,
      error: false,
    };

    return postData;
  } catch (error) {
    return { error: true, status: 500 };
  }
}

export async function likedPosts(userID) {
  try {
    const db = getDatabase();

    const user = await db.collection("users").findOne({ userID: userID });
    if (user === null) {
      return { error: true, status: 404 };
    }

    const userLikes = await db
      .collection("likes")
      .find({ userID: userID, likeNotation: 1, likeType: "post" })
      .toArray();

    if (userLikes.length === 0) {
      return { posts: [], error: false, status: 200 };
    }

    const postIDs = new Set();
    for (const like of userLikes) {
      postIDs.add(like.parentID);
    }

    const userLikedPosts = await db
      .collection("posts")
      .find({ postID: { $in: [...postIDs] } })
      .toArray();

    const userIDs = userLikedPosts.map((p) => p.posterID);

    const users = await db
      .collection("users")
      .find({ userID: { $in: userIDs } })
      .toArray();
    const userMap = {};
    for (const user of users) {
      userMap[user.userID] = user.user_anonymity;
    }

    for (let i = 0; i < userLikedPosts.length; i++) {
      userLikedPosts[i]["posterName"] = userMap[userLikedPosts[i]["posterID"]];
    }
    return {
      posts: userLikedPosts,
      error: false,
      status: 200,
    };
  } catch (error) {
    return { error: true, status: 500 };
  }
}

export async function createdPosts(userID) {
  try {
    const db = getDatabase();

    const user = await db.collection("users").findOne({ userID });
    if (user === null) {
      return { error: true, status: 404 };
    }

    const userCreatedPosts = await db
      .collection("posts")
      .find({ posterID: userID })
      .sort({ postID: -1 })
      .toArray();

    for (let i = 0; i < userCreatedPosts.length; i++) {
      const postBody = userCreatedPosts[i].postBody;
      userCreatedPosts[i].preview = createPreview(postBody);
      userCreatedPosts[i].posterName = user.user_anonymity;
    }

    return {
      posts: userCreatedPosts,
      error: false,
      status: 200,
    };
  } catch (error) {
    return { error: true, status: 500 };
  }
}

export async function createPostObject(title, body, poster_id, channelID) {
  try {
    const db = getDatabase();
    const postID = await getNextPostID();

    const user = await db.collection("users").findOne({ userID: poster_id });
    if (user === null) {
      return {
        error: true,
        status: 404,
        message: "User not found",
      };
    }

    const newPost = {
      postID: postID,
      postTitle: title,
      postBody: body,
      posterID: poster_id,
      numLikes: 0,
      channelID: channelID,
    };

    await db.collection("posts").insertOne(newPost);
    return {
      error: false,
      status: 201,
      postData: newPost,
      message: "Post created successfully",
    };
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: String(error),
    };
  }
}

export async function deletePosts(postID, userID) {
  try {
    const db = getDatabase();

    if (!postID) {
      return {
        status: 400,
        error: true,
        deleted: false,
        message: "Post ID is required",
      };
    }

    const posting = await db.collection("posts").findOne({ postID: postID });

    if (posting === null) {
      return {status: 404, error: true, deleted: false, message: "Post not found"}
    }

    const posterID = posting.posterID;

    if (userID != posterID) {
      return {
        status: 401,
        error: true,
        deleted: false,
        message: "User unaouthorized to delete post",
      };
    }

    const comments = await db
      .collection("comments")
      .find({ postID: postID })
      .toArray();
    const commentIDs = comments.map((comment) => comment.commentID);

    await db.collection("comments").deleteMany({ postID: postID });
    await db.collection("likes").deleteMany({ parentID: postID, likeType: "post" });

    if (commentIDs.length > 0) {
      await db.collection("likes").deleteMany({
        parentID: { $in: commentIDs },
        likeType: "comment",
      });
    }

    const deleted = await db.collection("posts").deleteOne({ postID: postID });

    if (deleted.deletedCount === 1) {
      return {
        status: 200,
        error: false,
        deleted: true,
        message: "Deleted post",
      };
    }

    return {
      status: 500,
      error: true,
      deleted: false,
      message: "Error in deleting post",
    };
  } catch (error) {
    return {
      status: 500,
      error: true,
      deleted: false,
      message: error.message,
    };
  }
}
