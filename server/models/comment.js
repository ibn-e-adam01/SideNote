const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    authorName: String,
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    commentedOn: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('comment', commentSchema);