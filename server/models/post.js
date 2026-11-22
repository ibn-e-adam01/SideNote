const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    post: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    authorName: String,
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    postedOn: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('post', postSchema);