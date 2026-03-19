import * as likeService from "./likes.service.js";

export async function registerLike(req, res) {
  try {
    const { parentID, userID, likeNotation, likeType } = req.body;

    const registered = await likeService.likeFunc(
      parentID,
      userID,
      likeNotation,
      likeType,
    );
    if (registered.error === true && registered.status != 201) {
      res
        .status(registered.status)
        .json({ error: true, message: registered.message });
    }

    res.status(201).json({
      error: false,
      message: registered.message,
      like: registered.likeData,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: String(err) });
  }
}
