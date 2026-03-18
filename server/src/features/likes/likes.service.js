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
        let object = null;

        if (likeType === "post") {
            object = await db.collection("posts").findOne({postID: parentID});

            if (object === null) {
                return {error: true, status: 404, message: "Post not found"};
            }
        } else {
            object = await db.collection("comments").findOne({commentID: parentID});

            if (object === null) {
                return {error: true, status: 404, message: "comment not found"};
            }
        }

        const user = await db.collection("users").findOne({userID: userID});
        if (user === null) {
            return {error: true, status: 404, message:"User not found"};
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
