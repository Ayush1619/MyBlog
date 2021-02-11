//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Never supress your feeling just express it . Put your thought here. Your word from your heart all in one place.";
const aboutContent = "We are providing a blog where you can share your daily thought. A Blog for all aspiring writers who can share their idea/thought in one place.";
const contactContent = "You've gotta dance like there's nobody watching,Love like you'll never be hurt,Sing like there's nobody listening, And live like it's heaven on earth.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//Ayush adding begin

//Ayush adding ends


const messageSchema = mongoose.Schema({
  
    userId:String,
    text:String
  
  
  
}) 

const postSchema = {
  title: String,
  content: String,
  message:[messageSchema]
};
const Post = mongoose.model("Post", postSchema)

//end mongoose



app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home.ejs", {
      plot: homeStartingContent,
      posts: posts
    });
  })

})
app.get("/about", function(req, res) {
  res.render("about.ejs", {
    plot2: aboutContent
  });
})
app.get("/contact", function(req, res) {
  res.render("contact.ejs", {
    plot3: contactContent
  });
})
app.get("/compose", function(req, res) {
  res.render("compose.ejs");
})
app.post("/compose", function(req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.blogPost
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });


})

app.get('/posts/:postId', function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post.ejs", {
      title: post.title,
      content: post.content,
      id:post._id
    });
  });

});



//delete
app.post("/delete",function(req,res){
  const postId = req.body.delete;
  Post.findByIdAndRemove(postId,function(err){
    if(!err){
      console.log("successfully deleted");
      res.redirect("/");
    }
  })
});
//end

// add messages
app.get('/message/:postId', function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    
    res.render("message", {
      title: post.title,
      content: post.content,
      id:post._id,
      user:post.message
      
    });
    
  });

});

// app.get('/message/:postId',function(req,res){
//   const messageId = req.params.postId;
//   Post.findOne({"message.comment":{$elemMatch:{_id:messageId }}},function(err,message){
//     res.render("message",{
//       id:messageId,
//       user:message.userId,
//       text:message.text

//     });
//   });
// });
app.post('/message/:postId',function(req,res){
    const postId = req.params.postId;
    const {user,message} = req.body
     //console.log(postId,user,message);
    Post.findByIdAndUpdate(postId,{$push:{message:{userId:user,text:message}}},
      function(err){
        if(!err){
          res.redirect('/')
        }
        }) 
})

//add messagesEnd




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
