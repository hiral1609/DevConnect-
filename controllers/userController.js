const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'username profilePic')
            .populate('following', 'username profilePic');
            
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            if (req.body.skills) {
                user.skills = Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim());
            }
            if (req.file) {
                user.profilePic = '/uploads/' + req.file.filename;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                bio: updatedUser.bio,
                skills: updatedUser.skills,
                profilePic: updatedUser.profilePic
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const keyword = req.query.q ? {
            $or: [
                { username: { $regex: req.query.q, $options: 'i' } },
                { skills: { $regex: req.query.q, $options: 'i' } }
            ]
        } : {};

        const users = await User.find(keyword).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const followUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        res.json({ message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Optional: Remove all posts created by the user
        await require('../models/Post').deleteMany({ userId: userId });
        
        // Delete the user
        await User.findByIdAndDelete(userId);
        
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile, searchUsers, followUser, deleteProfile };
