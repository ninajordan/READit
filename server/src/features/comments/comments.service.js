import { getDatabase } from "../../config/db.js";

async function getNextCommentID() {
  const db = getDatabase();
  const lastPost = await db
    .collection("comments")
    .find({})
    .sort({ commentID: -1 })
    .limit(1)
    .toArray();

  if (lastPost.length === 0) {
    return "001";
  }

  const lastIdNumber = parseInt(lastPost[0].commentID, 10);
  const incrementedId = lastIdNumber + 1;

  return incrementedId.toString().padStart(3, "0");
}

export async function postAComment(commentData, postID, userID) {
  try {
    const db = getDatabase();

    const commentID = await getNextCommentID();
    const post = await db.collection("posts").findOne({ postID: postID });
    if (post === null) {
      return { error: true, status: 404, message: "Post not found" };
    }

    const user = await db.collection("users").findOne({ userID: userID });
    if (user === null) {
      return { error: true, status: 404, message: "user not found" };
    }

    const newComment = {
      commentContent: commentData,
      postID: postID,
      commentID: commentID,
      userID: userID,
      numLikes: 0,
    };
    await db.collection("comments").insertOne(newComment);

    return {
      error: false,
      status: 201,
      message: "Comment posted",
      commentData: newComment,
    };
  } catch (error) {
    return { error: true, status: 500, message: String(error) };
  }
}
