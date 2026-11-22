const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
    },
    tagname: String,
    bio: String,
    email: {
        type: String
    },
    password: String,
    joined: {
        type: Date,
        default: Date.now
    },
    posts:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    likedPosts:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    commentedPosts:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
});

module.exports = mongoose.model('user', userSchema);