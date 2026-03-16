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