const Post = require('../models/Post');

const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        let image = '';
        let video = '';
        
        if (req.file) {
            if (req.file.mimetype.startsWith('video/')) {
                video = '/uploads/' + req.file.filename;
            } else {
                image = '/uploads/' + req.file.filename;
            }
        }

        const post = new Post({
            userId: req.user._id,
            content,
            image,
            video
        });

        const createdPost = await post.save();
        // Populate user info before returning
        const populatedPost = await Post.findById(createdPost._id).populate('userId', 'username profilePic');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeed = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('userId', 'username profilePic')
            .populate('comments.userId', 'username profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.includes(req.user._id);

        if (isLiked) {
            post.likes.pull(req.user._id);
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ message: isLiked ? 'Post unliked' : 'Post liked', likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        post.comments.push({ userId: req.user._id, text });
        await post.save();
        res.status(201).json(post.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id })
            .populate('userId', 'username profilePic')
            .populate('comments.userId', 'username profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPost, getFeed, likePost, deletePost, commentPost, getUserPosts };
