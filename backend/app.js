const express = require('express')
const bodyParser = require('body-parser')
const Post = require('./models/post');
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const User = require("./models/user");
const jwt = require('jsonwebtoken');
const checkAuth = require("./middleware/check-auth");

mongoose.connect("mongodb+srv://max:yaAYKiFKFav5JkRw@cluster0.gknmv.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database');
  })
  .catch (() => {
    console.log('Connection failed');
  });


app.use(bodyParser.json());

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.put("/api/posts/:id", checkAuth, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});
app.post("/api/posts", checkAuth, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost => {
    console.log(post)
    res.status(200).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });

  console.log(post);
  res.status(201).json({
  message: 'Post added successfully'
  });

});

app.get('/api/posts',(req, res, next)=>{
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: documents
    });
  })
});

app.delete('/api/posts/:id', checkAuth, (req, res, next)=>{
  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({message: "Post deleted!"});

  })

});

app.post('/api/user/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result =>{
      res.status(201).json({
        message: 'User created',
        result:result
      });
    })
    .catch(err => {
      res.status(500).json({
        error:err
      });
    });
  });
});

app.post('/api/user/login',(req, res, next)=>{
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user =>{
      if(!user){
        return res.status(401).json({
          message: 'Auth failed'

        });
      }
      fetchedUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if(!result){
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret this should be longer',
        {expresIn: '1h'}
      );
      res.status(200).json({
        token: token
      })
    })
    .catch(err =>{
      return res.status(401).json({
        message: 'Auth failed'
      });
    })
})
module.exports = app;
