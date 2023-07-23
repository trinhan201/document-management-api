import Comment from '../models/Comment.js';
import User from '../models/User.js';

export const createCommentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const taskId = req.body.taskId;
        const newComment = new Comment({ ...req.body, userId: req.user._id, taskId: taskId });

        await newComment.save();
        res.status(200).json({ code: 200, message: 'Bình luận thành công' });
    } catch (err) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

export const updateCommentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ code: 404, message: 'Comment not found' });
        if (comment.userId !== req.user._id) return res.status(404).json({ code: 403, message: 'Unauthorized' });
        await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                $set: { content: req.body.content },
            },
            { new: true },
        );

        res.status(200).json({ code: 200, message: 'Cập nhật bình luận thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

export const deleteCommentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ code: 404, message: 'Comment not found' });
        if (comment.userId !== req.user._id) return res.status(404).json({ code: 403, message: 'Unauthorized' });
        await Comment.findByIdAndDelete(req.params.commentId);

        res.status(200).json({ code: 200, message: 'Xóa bình luận thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

export const getAllCommentController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const comments = await Comment.find({}).sort({ createdAt: -1 });
        res.status(200).json({ code: 200, message: 'Successfully', data: comments });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

export const getCommentByIdController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ code: 404, message: 'Comment not found' });

        res.status(200).json({ code: 200, message: 'Successfully', data: comment });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};
