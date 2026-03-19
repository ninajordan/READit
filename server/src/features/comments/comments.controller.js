import * as commentService from "./comments.service.js";

export async function writeComment(req, res) {
  try {
    const { commentData, post_id, user_id } = req.body;

    const postedComment = await commentService.postAComment(
      commentData,
      post_id,
      user_id,
    );

    if (postedComment.status !== 201) {
      res
        .status(postedComment.status)
        .json({ error: true, message: postedComment.message });
    }

    res.status(201).json({
      error: false,
      message: "Posted Comment",
      comment: postedComment.commentData,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: String(err) });
  }
}
