import * as postsService from './posts.service.js';

export async function getAllPosts(req, res) {
    try {
        const limit = Number(req.query.limit ?? 20);
        const start = Number(req.query.start ?? 0);

        const postList = await postsService.listAllPosts(limit, start);
        const posts = postList.posts;
        console.log(`Posts: ${postList.metadata.total}`);
        if (posts.length === 0) {
            res.status(200).json({
                "posts":[],
                "message":"No posts found"
            });
        } else {
            res.status(200).json({
                "metadata": postList.metadata,
                "posts":postList.posts,
                "message":"Posts fetched"
            }) ;
        }
    } catch (error) {
        res.status(500).json({
            "error": true,
            "message":String(error)
        });
    }
}

export async function viewChannelPosts(req, res) {
    try {
        const limit = Number(req.query.limit ?? 20);
        const start = Number(req.query.start ?? 0);
        const {channelID} = req.params;

        const postList = await postsService.listChannelPosts(channelID, limit, start);
        const posts = postList.posts;
        console.log(`Posts: ${postList.metadata.total}`);
        if (posts.length === 0) {
            res.status(200).json({
                "posts":[],
                "message":"No posts found"
            });
        } else {
            res.status(200).json({
                "metadata": postList.metadata,
                "posts":postList.posts,
                "message":"Posts fetched"
            }) ;
        }
    } catch (error) {
        res.status(500).json({
            "error": true,
            "message":String(error)
        });
    }
}

export async function viewPostById(req, res) {
    try {
        const {id} = req.params;
        const postData = await postsService.getPostById(id);

        if (postData.error === true && postData.status === 404) {
            return res.status(404).json({"error": true, "message":"Post not found"});
        }

        return res.status(200).json({
            "postData": postData,
            "message":"Post Information Fetched."
        });
    } catch (error) {
        return res.status(500).json({"error": true, "message":"Internal Server Error"});
    }
}

export async function userLikedPosts(req, res) {
    try {
        const {userID} = req.params;

        const likedPosts = await postsService.likedPosts(userID);
        if (likedPosts.error === true && likedPosts.status === 404) {
            return res.status(404).json({"error":true, "message":"user not found"});
        }

        const posts = likedPosts.posts;
        if (posts.length === 0) {
            return res.status(200).json({"error":false, "message":"No Liked Posts yet"});
        }

        return res.status(200).json({"error":false, "posts":posts});
    } catch(error) {
        return res.status(500).json({"error":true, "message":"internal server error"});
    }
}

export async function createPost(req, res) {
    try {
        const {postTitle, postBody, posterID, channelID} = req.body;

        let channel_id = null
        if (channelID === "-1") {
            channel_id = null;
        } else {
            channel_id = channelID;
        }

        const postCreated = await postsService.createPostObject(postTitle, postBody, posterID, channel_id);
        if (postCreated.error === true) {
            res.status(postCreated.status).json({"error":true, "message":postCreated.message});
        }

        const response = {
            "message": "Post created successfully",
            "post": postCreated.postData
        };
        res.status(201).json({"error":false, "message":response.message, "post":response});
    } catch (error) {
        res.status(500).json({"error":true, "message":String(error)});
    }
}
