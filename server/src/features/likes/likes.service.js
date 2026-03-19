import { getDatabase } from "../../config/db.js";

async function getNextLikeID() {
    const db = getDatabase();
    const lastPost = await db
    .collection("likes")
    .find({})
    .sort({ likeID: -1 })
    .limit(1)
    .toArray();

    if (lastPost.length === 0) {
        return "001";
    }

    const lastIdNumber = parseInt(lastPost[0].likeID, 10);
    const incrementedId = lastIdNumber + 1;

    return incrementedId.toString().padStart(3, "0");
}

export async function likeFunc(parentID, userID, likeNotation, likeType) {

    try {
        const db = getDatabase();
        const user = await db.collection("users").findOne({userID: userID});
        if (user === null) {
            return {error: true, status: 404, message:"User not found"};
        }

        if (likeType === "post") {
            const post = await db.collection("posts").findOne({ postID: parentID });
            if (post === null) {
                return {error: true, status: 404, message: "Post not found"};
            }
        } else {
            const comment = await db.collection("comments").findOne({ commentID: parentID });
            if (comment === null) {
                return {error: true, status: 404, message: "comment not found"};
            }
        }

        const existingLike = await db
            .collection("likes")
            .findOne({ userID: userID, parentID: parentID, likeType: likeType });

        if (existingLike) {
            if (existingLike.likeNotation === likeNotation) {
                await db.collection("likes").deleteOne({ likeID: existingLike.likeID });
                if (likeType === "post") {
                    await db.collection("posts").updateOne(
                        { postID: parentID },
                        { $inc: { numLikes: -1 } }
                    );
                } else {
                    await db.collection("comments").updateOne(
                        { commentID: parentID },
                        { $inc: { numLikes: -1 } }
                    );
                }
                return {error: false, status: 200, message: "Like removed"};
            }

            const delta = likeNotation - existingLike.likeNotation;
            await db.collection("likes").updateOne(
                { likeID: existingLike.likeID },
                { $set: { likeNotation: likeNotation } }
            );
            if (likeType === "post") {
                await db.collection("posts").updateOne(
                    { postID: parentID },
                    { $inc: { numLikes: delta } }
                );
            } else {
                await db.collection("comments").updateOne(
                    { commentID: parentID },
                    { $inc: { numLikes: delta } }
                );
            }
            return {error: false, status: 200, message: "Like updated"};
        }

        if (likeType === "post") {
            await db.collection("posts").updateOne(
                { postID: parentID },
                { $inc: { numLikes: likeNotation } }
            );
        } else {
            await db.collection("comments").updateOne(
                { commentID: parentID },
                { $inc: { numLikes: likeNotation } }
            );
        }

        const likeID = await getNextLikeID();

        const newLike = {
            likeType: likeType,
            likeNotation: likeNotation,
            likeID: likeID,
            parentID: parentID,
            userID: userID
        };

        const liked = await db.collection("likes").insertOne(newLike);
        return {error: false, status: 201, message: "Registered the interaction", likeData: liked}
    } catch (err) {
        return {error: true, status: 500, message: String(err)}
    }
}
