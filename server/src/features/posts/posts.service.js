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

    const lastIdNumber = parseInt(lastPost[0].userID, 10);
    const incrementedId = lastIdNumber + 1;

    return incrementedId.toString().padStart(3, "0");
}

function createPreview(text){

    if(text.length > 120) {
        const preview = text.slice(0, 120);
        return `${preview}...`;
    } else {
        return text;
    }
}

export async function listAllPosts(limit = 20, start = 0) {
    try{
        const db = getDatabase();
        
        const allPosts = await db.collection("posts").find({}).sort({postID: -1}).toArray();

        if (start > allPosts.length) {
            start = 0;
        }
        const end = Math.min(start + limit, allPosts.length);
        const postsToSend = allPosts.slice(start, end);

        for (const i = 0; i < postsToSend.length; i++) {
            const postBody = postsToSend[i].postBody;
            const preview = createPreview(postBody);
            postsToSend[i]['preview'] = preview;
        }

        const response = {
            "metadata": {
                "total":allPosts.length,
                "start":start,
                "end":end,
                "limit":limit,
            },
            "posts":postsToSend
        };

        return response;
    } catch (error) {

        console.log("[POSTS SERVICE ERROR] Ran into Error: ", String(error));
        return {
            "metadata":{},
            "posts":[]
        }
    }
}

export async function listChannelPosts(channelID, limit = 20, start = 0) {
    try{
        const db = getDatabase();

        const channel = await db.collection("channels").findOne({channelID: channelID});
        if (channel === null) {
            return {
                "metadata":{},
                "posts":[]
            }
        }
        const allPosts = await db.collection("posts").find({channelID: channelID}).sort({postID: -1}).toArray();

        if (start > allPosts.length) {
            start = 0;
        }
        const end = Math.min(start + limit, allPosts.length);
        const postsToSend = allPosts.slice(start, end);

        for (const i = 0; i < postsToSend.length; i++) {
            const postBody = postsToSend[i].postBody;
            const preview = createPreview(postBody);
            postsToSend[i]['preview'] = preview;
        }

        const response = {
            "metadata": {
                "total":allPosts.length,
                "start":start,
                "end":end,
                "limit":limit,
            },
            "posts":postsToSend
        };

        return response;
    } catch (error) {

        console.log("[POSTS SERVICE ERROR] Ran into Error: ", String(error));
        return {
            "metadata":{},
            "posts":[]
        }
    }
}