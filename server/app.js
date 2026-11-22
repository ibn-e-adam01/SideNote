require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);


const userModel = require('./models/user');
const postModel = require('./models/post');
const commentModel = require('./models/comment');
const requireAuth = require('./middlewares/auth');

const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: [ 'http://localhost:5173',
        'https://thesidenote.vercel.app'
    ],
    credentials: true
}));

app.post('/createAccount', async (req, res) => {
    let {Username, Email, Password} = req.body;

    if(Username == '' || Username == ' '){
        return res.status(400).json({
            message1: 'Enter required username!',
            success: false
        })
    }
    else if(Email == '' || Email == ' '){
        return res.status(400).json({
            message2: 'Enter required email!',
            success: false
        })
    }
    else if(Password == '' || Password == ' '){
        return res.status(400).json({
            message3: 'Enter required password!',
            success: false
        })
    }


    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(Password, salt, async (err, hash) => {
            let user = await userModel.create({
            username: Username,
            tagname:  '@' + ((Username).replaceAll(' ', '')).toLowerCase() + Math.floor(Math.random() * 90) + 10,
            email: Email,
            password: hash
            })

            let token = jwt.sign({_id:user._id, email: Email}, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });
            res.cookie('token', token, {
                httpOnly: true,
                secure:isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).json({
                message:'successfully account created',
                success: true,
                user
            });
            // console.log(user);
        })
    })
    
});
app.post('/signIn', async (req, res) => {
    let {Email, Password} = req.body;
    let user = await userModel.findOne({email: Email});

    if(Email == '' || Email == ' '){
        return res.status(400).json({
            message1: 'Enter required email!',
            success: false
        })
    }
    if(Password == '' || Password == ' '){
        return res.status(400).json({
            message2: 'Enter required password!',
            success: false
        })
    }

    if(!user){
        return res.status(400).json({
            message3:'User not found!',
            success: false
        })
    }

    let token = jwt.sign({_id: user._id, email: Email}, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

    bcrypt.compare(Password, user.password, (err, result) => {
        if(result){
            return res.cookie('token', token, {
                httpOnly: true,
                secure:isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).status(200).json({
                message:'successfully logged in!',
                success:true,
                user
            })
        } else{
            return res.status(400).json({
                message4:'incorrect password!',
                success: false
            })
        }
    })

});


app.get('/getuser', requireAuth, async (req, res) => {
    let token = req.cookies.token;
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verifiedToken);

    let user = await userModel.findOne({_id: verifiedToken._id});

    // console.log("The Logged in user is: \n", user); //working!
    
    if(user){
    return res.status(200).json({
        message:'user exists!',
        success:true,
        user
        })
    }
});

app.get('/getposts', requireAuth, async (req, res) => {
    let token = req.cookies.token;
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verifiedToken);

    let user = await userModel.findOne({_id: verifiedToken._id});

    // console.log("The Logged in user while getting post info. is: \n", user); //working!
    
    let posts = await postModel.find({author: user._id});
    // console.log("My Posts: \n", posts); //working!

    if(posts){
        return res.status(200).json({
            message: 'your posts fetched!',
            success: true,
            posts
        })
    }
});

app.get('/getAllposts', async (req, res) => {
    let allposts = await postModel.find();

    // console.log("All Posts are here: \n", allposts); //working!

    res.status(200).json({
        message: 'all posts fetched!',
        success:true,
        allposts
    })
})

app.post('/createPost', async (req, res) => {
    let {Post} = req.body;
    let token = req.cookies.token;
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verifiedToken);

    let user = await userModel.findOne({_id: verifiedToken._id});

    // console.log("The Logged in user in Home is: \n", user); //working
    // console.log(Post); //working!

    let post = await postModel.create({
        post: Post,
        author: user._id,
        authorName: user.username
    });

    if(post){

        user.posts.unshift(post._id); //push adds at end, unshift adds at 0th index
        await user.save();


        return res.status(200).json({
            message:'posted!',
            success:true,
            post
        })
    }

});

app.post('/logout', (req, res) => {
    res.cookie('token', '', {
                httpOnly: true,
                secure:isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).status(200).json({
        message:'successfully logged out!',
        success: true
    })
})


app.post('/createComment/:postId', requireAuth, async (req, res) => {
    const user = req.user //from protected route/auth-middleware!
    //gives only id and email stored in token!

    const fullUser = await userModel.findOne({_id: user._id});

    // console.log("The full user commenting is: \n", fullUser); //working!
    // console.log(Comment); //working!
    // console.log("The user commenting is: \n", user) //working!

    if(user || fullUser){

        let post_id = req.params;

        // console.log(post_id.postId); //gives the id inside the post_id object

        let {Comment} = req.body;


        const comment = await commentModel.create({
        comment: Comment,
        author: user._id,
        authorName: fullUser.username,
        postId: post_id.postId
        });

        // console.log(comment); //working

        const post = await postModel.findOne({_id: post_id.postId});

        // console.log(post); //working

        post.comments.unshift(comment._id); //push adds at end, unshift adds at 0th index
        await post.save();

        fullUser.commentedPosts.unshift(comment._id);
        await fullUser.save();

        res.status(200).json({
        message: "commented!",
        success: true,
        comment
        })
    }
});

app.post('/addLike/:postId', requireAuth, async (req, res) => {
    const user = req.user //from protected route/auth-middleware!
    //gives only id and email stored in token!

    const fullUser = await userModel.findOne({_id: user._id});

    // console.log("The full user liking is: \n", fullUser); //working!
    // console.log("The user liking is: \n", user) //working!

    if(user || fullUser){

        let post_id = req.params;

        // console.log(post_id.postId); //gives the id inside the post_id object

        const post = await postModel.findOne({_id: post_id.postId});

        if(!fullUser.likedPosts.includes(post._id)){ //for uniqueness!
            fullUser.likedPosts.unshift(post._id);
            await fullUser.save();

            post.likes.unshift(fullUser._id);
            await post.save();

            // console.log('User liking is: \n', fullUser); //working
            // console.log('post liked: \n',post); //working

            res.status(200).json({
            message: "liked!",
            success: true,
            post
            });
        }

        
    }
});

app.get('/getComments/:CmtPostId', requireAuth, async (req, res) => {

    const user = req.user //from protected route/auth-middleware!
    //gives only id and email stored in token!

    const fullUser = await userModel.findOne({_id: user._id});

    // console.log("The full user commenting is: \n", fullUser); //working!
    // console.log("The user commenting is: \n", user); //working!

    if(user || fullUser){
        let CmtPostId = req.params;
        // console.log(CmtPostId.CmtPostId);

        let Comments = await postModel.findById({_id: CmtPostId.CmtPostId}).populate("comments");
        //.populate() works when you have used ref in model, and what it does is: give us complete model of comment ids stored instead of just array of comment ids stored!


        if(Comments){
            // console.log("These are comments: \n",Post);

            res.status(200).json({
                message:"comments loaded!",
                success:true,
                Comments
            });
        }

       
    }
});

app.delete('/deletePost/:postId', requireAuth, async (req, res) => {
    const user = req.user //from protected route/auth-middleware!
    //gives only id and email stored in token!

    const fullUser = await userModel.findOne({_id: user._id});

    // console.log("The full user commenting is: \n", fullUser); //working!
    // console.log("The user commenting is: \n", user); //working!

    if(user || fullUser){
        let postId = req.params;
        // console.log(postId.postId);

        const post = await postModel.findOne({_id: postId.postId, author: fullUser._id});
        //so that only author of post can delete the post!
        // console.log("Found author post: \n",post);

        if(!post) {
            return res.status(404).json({
                message: 'Post not found or unauthorized!'
            });
        }

        //removing postId from all user's field arrays!
        await userModel.updateMany({}, {
            $pull: {
                posts: postId.postId,
                likedPosts: postId.postId,
                commentedPosts: postId.postId
            }
        });

        //deleting all comments belonging to this post
        await commentModel.deleteMany({postId: postId.postId});

        //deleting the post itself
        await postModel.findOneAndDelete({_id: postId.postId});

        // const findDeletedPost = await postModel.findById({_id: postId.postId});
        // console.log(findDeletedPost); //null => deleted post!

        res.status(200).json({
            message:'Post deleted successfully!',
            success:true
        })
    }
});

app.patch('/removeLike/:postId', requireAuth, async (req, res) => {
    const user = req.user //from protected route/auth-middleware!
    //gives only id and email stored in token!

    const fullUser = await userModel.findOne({_id: user._id});

    // console.log("The full user commenting is: \n", fullUser); //working!
    // console.log("The user commenting is: \n", user); //working!

    if(user || fullUser){
        let postId = req.params;

        // const post = await postModel.findOne({_id: postId.postId, likes: fullUser._id});
        // // so that only person who liked the post can unlike the post!
        // console.log("Found author Like: \n",post);

        // if(!post) {
        //     return res.status(404).json({
        //         message: 'Post not found or unauthorized!'
        //     });
        // }

        //removing postId from all likedPosts field arrays!
        await userModel.findOneAndUpdate({_id: user._id},
            {$pull: {
                likedPosts: postId.postId
            }},
             {returnDocument : 'after'});

        await postModel.findOneAndUpdate({_id: postId.postId}, {
            $pull: {
                likes: fullUser._id
            }
        },
        {returnDocument: 'after'}
    );

        // const findDeletedPost = await postModel.findById({_id: postId.postId});
        // console.log(findDeletedPost); //null => deleted post!

        res.status(200).json({
            message:'unliked successfully!',
            success:true
        })
    }
});

app.patch('/updateProfile', requireAuth, async (req, res) => {
    const user = req.user //from protected route/auth-middleware!
    //gives only id and email stored in token!

    const fullUser = await userModel.findOne({_id: user._id});

    // console.log("The full user commenting is: \n", fullUser); //working!
    // console.log("The user commenting is: \n", user); //working!

    if(user || fullUser){

        let {username, tagname, bio} = req.body;
        // console.log(username);
        // console.log(tagname);
        // console.log(bio);

        const updateUser = await userModel.findOneAndUpdate({
            _id: user._id
        }, {
            username,
            tagname,
            bio:bio
        }, { returnDocument: 'after' }
    );

        // console.log(updateUser); working!!

        res.status(200).json({
            message:'updated!',
            success:true
        })

    }

})

app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT}...`);
});