const Comment = require('../models/comment');
const Post = require('../models/post');

// module.exports.create = function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             },function(err,comment){
//                 //handle error

//                 post.comments.push(comment);
//                 post.save();

                  // res.redirect('/');
//             });
//         }
//     });
// }
module.exports.create = function (req, res) {
  Post.findById(req.body.post)
    .then((post) => {
      if (post) {
        return Comment.create({
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        }).then((comment) => {
          post.comments.push(comment);
          return post.save();
        });
      } else {
        throw new Error("Post not found");
      }
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).send("Error creating comment: " + err.message);
    });
};